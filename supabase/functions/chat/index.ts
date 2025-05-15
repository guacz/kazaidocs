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
    const { messages, documentType, templateId, formData } = await req.json();

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

    // System prompt to define the AI's role and behavior
    const systemPrompt = {
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

    // Detect document type from the conversation if not already set
    let detectedDocType = documentType;
    if (!detectedDocType) {
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

    // Determine if the document is ready to generate
    // For this prototype, we'll assume it's ready after 5 message exchanges
    const isDocumentReady = messages.length >= 5;

    return new Response(
      JSON.stringify({
        response: assistantResponse,
        documentType: detectedDocType,
        documentStatus: isDocumentReady ? 'ready' : 'in_progress'
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