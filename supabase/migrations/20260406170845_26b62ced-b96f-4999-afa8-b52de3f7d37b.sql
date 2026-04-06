INSERT INTO storage.buckets (id, name, public)
VALUES ('books', 'books', false);

CREATE POLICY "Allow public read of books" ON storage.objects
  FOR SELECT USING (bucket_id = 'books');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  amount integer NOT NULL DEFAULT 5000,
  currency text NOT NULL DEFAULT 'XOF',
  payment_ref text,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read orders by ref" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Service role can update orders" ON public.orders
  FOR UPDATE USING (true);