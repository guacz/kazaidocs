// OpenAI integration Edge Function for secure API access

import { OpenAI } from "npm:openai@4.28.4";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Environment variables set in Supabase
const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { messages, documentType, templateId, formData, mode = "document" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages must be an array" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // If the request includes a template ID and form data, use the template-based generation
    if (templateId && formData) {
      // Get the template from the database
      const { data: template, error: templateError } = await supabase
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (templateError) {
        return new Response(
          JSON.stringify({ error: "Template not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Use the template to generate a document
      // In a real implementation, this would fill the template with the form data
      // and convert it to a document format

      return new Response(
        JSON.stringify({
          documentUrl: `/documents/template_${template.document_type}_${Date.now()}.pdf`,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Choose appropriate system prompt based on the mode
    let systemPrompt;
    
    if (mode === "consultation") {
      systemPrompt = {
        role: "system",
        content: `You are a legal assistant specializing in Kazakhstan law. 
        Your purpose is to provide consultations about legal matters based STRICTLY on Kazakhstan's legislation.
        You must ONLY provide information from official legal sources and documents that have been uploaded to the knowledge base.
        NEVER make up or invent information that is not in your knowledge base.
        Always respond in the same language the user is using (Kazakh or Russian).
        When providing answers, cite the specific legal articles, codes, or documents you're referencing.
        If you don't have information on a specific legal question, admit that you don't have that information rather than guessing.`
      };
    } else {
      systemPrompt = {
        role: "system",
        content: `You are a legal assistant specializing in Kazakhstan law. 
        Your purpose is to help users create legal documents. 
        Provide clear explanations and ask relevant questions to gather necessary information.
        Always respond in the same language the user is using (Kazakh or Russian).
        ${documentType ? `The user is creating a ${documentType} document.` : ""}
        Base all advice and documents on current Kazakhstan legislation.
        
        You can now also recommend users to use pre-made templates for faster document creation.
        When appropriate, mention that they can use templates by clicking the "Use Template" button.`
      };
    }

    // Add the system message at the beginning if not already present
    const formattedMessages = [
      systemPrompt,
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const assistantResponse = response.choices[0]?.message?.content || "";

    // In consultation mode, we would retrieve references from our knowledge base
    // For this prototype, we'll simulate with mock references when relevant keywords are found
    let references;
    if (mode === "consultation") {
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
      if (lastUserMessage) {
        const content = lastUserMessage.content.toLowerCase();
        if (content.includes("договор")) {
          references = [
            {
              title: "Гражданский кодекс РК, статья 393",
              content: "Договор считается заключенным, когда между сторонами в требуемой в подлежащих случаях форме достигнуто соглашение по всем существенным условиям договора."
            }
          ];
        } else if (content.includes("трудов")) {
          references = [
            {
              title: "Трудовой кодекс РК, статья 33",
              content: "Трудовой договор - письменное соглашение между работником и работодателем, в соответствии с которым работник обязуется лично выполнять определенную работу, а работодатель обязуется предоставить работу, выплачивать работнику заработную плату и обеспечивать условия труда."
            }
          ];
        }
      }
    }

    // Detect document type from the conversation if not already set and in document mode
    let detectedDocType = documentType;
    if (mode === "document" && !detectedDocType) {
      const documentKeywords = {
        'купля-продажа': 'purchase_sale',
        'продажа': 'purchase_sale',
        'купить': 'purchase_sale',
        'продать': 'purchase_sale',
        'аренда': 'lease',
        'арендовать': 'lease',
        'сдать в аренду': 'lease',
        'услуга': 'services',
        'услуги': 'services',
        'оказание услуг': 'services',
        'подряд': 'contract_work',
        'работы': 'contract_work',
        'выполнение работ': 'contract_work',
        'трудовой': 'employment',
        'найм': 'employment',
        'работа': 'employment',
      };

      // Check the last user message for keywords
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
      if (lastUserMessage) {
        for (const [keyword, type] of Object.entries(documentKeywords)) {
          if (lastUserMessage.content.toLowerCase().includes(keyword.toLowerCase())) {
            detectedDocType = type;
            break;
          }
        }
      }
    }

    // Determine if the document is ready to generate (only relevant in document mode)
    const isDocumentReady = mode === "document" && messages.length >= 5;

    return new Response(
      JSON.stringify({
        response: assistantResponse,
        documentType: detectedDocType,
        documentStatus: isDocumentReady ? 'ready' : 'in_progress',
        references
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});