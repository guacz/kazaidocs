/*
  # Create templates system

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `content` (text)
      - `document_type` (text)
      - `created_at` (timestamp)
    - `template_fields`
      - `id` (uuid, primary key)
      - `template_id` (uuid, foreign key)
      - `field_name` (text)
      - `display_name` (text)
      - `field_type` (text)
      - `required` (boolean)
      - `order` (integer)
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  content text NOT NULL,
  document_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create template_fields table
CREATE TABLE IF NOT EXISTS template_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  display_name text NOT NULL,
  field_type text NOT NULL,
  required boolean DEFAULT true,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(template_id, field_name)
);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_fields ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Templates are viewable by all users"
  ON templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Templates are editable by admins only"
  ON templates
  FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Create policies for template_fields
CREATE POLICY "Template fields are viewable by all users"
  ON template_fields
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Template fields are editable by admins only"
  ON template_fields
  FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Insert some example templates
INSERT INTO templates (name, description, content, document_type)
VALUES
  (
    'Договор купли-продажи', 
    'Базовый шаблон договора купли-продажи имущества',
    'ДОГОВОР КУПЛИ-ПРОДАЖИ

г. {{city}} {{date}}

{{seller_name}}, именуемый в дальнейшем «Продавец», с одной стороны, и {{buyer_name}}, именуемый в дальнейшем «Покупатель», с другой стороны, заключили настоящий Договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Продавец обязуется передать в собственность Покупателя, а Покупатель обязуется принять и оплатить следующее имущество: {{property_description}} (далее - "Имущество").

2. ЦЕНА И ПОРЯДОК РАСЧЕТОВ

2.1. Стоимость Имущества составляет {{price}} ({{price_in_words}}) тенге.
2.2. Оплата производится в следующем порядке: {{payment_terms}}.

3. ПЕРЕДАЧА ИМУЩЕСТВА

3.1. Имущество передается Продавцом Покупателю в течение {{delivery_period}} с момента подписания настоящего Договора.
3.2. Передача Имущества осуществляется по акту приема-передачи, подписываемому обеими сторонами.

4. ОТВЕТСТВЕННОСТЬ СТОРОН

4.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору стороны несут ответственность в соответствии с законодательством Республики Казахстан.

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

5.1. Настоящий Договор вступает в силу с момента его подписания обеими сторонами и действует до полного исполнения сторонами своих обязательств.
5.2. Все изменения и дополнения к настоящему Договору действительны, если они совершены в письменной форме и подписаны обеими сторонами.
5.3. Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.

6. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН

Продавец:                               Покупатель:
{{seller_details}}                      {{buyer_details}}

____________ / {{seller_name}} /         ____________ / {{buyer_name}} /
',
    'purchase_sale'
  ),
  (
    'Договор аренды помещения', 
    'Базовый шаблон договора аренды недвижимого имущества',
    'ДОГОВОР АРЕНДЫ

г. {{city}} {{date}}

{{lessor_name}}, именуемый в дальнейшем «Арендодатель», с одной стороны, и {{lessee_name}}, именуемый в дальнейшем «Арендатор», с другой стороны, заключили настоящий Договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Арендодатель обязуется предоставить Арендатору во временное пользование следующее недвижимое имущество: {{property_description}} (далее - "Помещение").
1.2. Помещение будет использоваться для: {{purpose}}.

2. СРОК АРЕНДЫ

2.1. Настоящий Договор заключен сроком на {{rental_period}} с {{start_date}} по {{end_date}}.

3. АРЕНДНАЯ ПЛАТА И ПОРЯДОК РАСЧЕТОВ

3.1. Ежемесячная арендная плата составляет {{monthly_rent}} ({{monthly_rent_in_words}}) тенге.
3.2. Арендная плата вносится не позднее {{payment_day}} числа каждого месяца.
3.3. Способ оплаты: {{payment_method}}.

4. ПРАВА И ОБЯЗАННОСТИ СТОРОН

4.1. Арендодатель обязуется:
   - Передать Помещение Арендатору в состоянии, пригодном для использования.
   - Обеспечить беспрепятственное пользование Помещением.

4.2. Арендатор обязуется:
   - Своевременно вносить арендную плату.
   - Использовать Помещение по назначению.
   - Поддерживать Помещение в надлежащем состоянии.
   - Вернуть Помещение Арендодателю в том состоянии, в котором он его получил.

5. ОТВЕТСТВЕННОСТЬ СТОРОН

5.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору стороны несут ответственность в соответствии с законодательством Республики Казахстан.

6. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

6.1. Настоящий Договор вступает в силу с момента его подписания обеими сторонами.
6.2. Все изменения и дополнения к настоящему Договору действительны, если они совершены в письменной форме и подписаны обеими сторонами.
6.3. Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.

7. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН

Арендодатель:                          Арендатор:
{{lessor_details}}                     {{lessee_details}}

____________ / {{lessor_name}} /        ____________ / {{lessee_name}} /
',
    'lease'
  );

-- Insert template fields
-- Fields for purchase-sale contract
INSERT INTO template_fields (template_id, field_name, display_name, field_type, required, "order")
VALUES
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'city', 'Город', 'text', true, 1),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'date', 'Дата договора', 'date', true, 2),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'seller_name', 'ФИО продавца', 'text', true, 3),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'buyer_name', 'ФИО покупателя', 'text', true, 4),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'property_description', 'Описание имущества', 'textarea', true, 5),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'price', 'Стоимость (цифрами)', 'number', true, 6),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'price_in_words', 'Стоимость (прописью)', 'text', true, 7),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'payment_terms', 'Условия оплаты', 'textarea', true, 8),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'delivery_period', 'Срок передачи имущества', 'text', true, 9),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'seller_details', 'Реквизиты продавца', 'textarea', true, 10),
  ((SELECT id FROM templates WHERE name = 'Договор купли-продажи'), 'buyer_details', 'Реквизиты покупателя', 'textarea', true, 11);

-- Fields for lease contract
INSERT INTO template_fields (template_id, field_name, display_name, field_type, required, "order")
VALUES
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'city', 'Город', 'text', true, 1),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'date', 'Дата договора', 'date', true, 2),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'lessor_name', 'ФИО арендодателя', 'text', true, 3),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'lessee_name', 'ФИО арендатора', 'text', true, 4),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'property_description', 'Описание помещения', 'textarea', true, 5),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'purpose', 'Цель использования', 'text', true, 6),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'rental_period', 'Срок аренды', 'text', true, 7),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'start_date', 'Дата начала', 'date', true, 8),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'end_date', 'Дата окончания', 'date', true, 9),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'monthly_rent', 'Ежемесячная плата (цифрами)', 'number', true, 10),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'monthly_rent_in_words', 'Ежемесячная плата (прописью)', 'text', true, 11),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'payment_day', 'День оплаты', 'number', true, 12),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'payment_method', 'Способ оплаты', 'text', true, 13),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'lessor_details', 'Реквизиты арендодателя', 'textarea', true, 14),
  ((SELECT id FROM templates WHERE name = 'Договор аренды помещения'), 'lessee_details', 'Реквизиты арендатора', 'textarea', true, 15);