-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    payment_method TEXT NOT NULL, -- 'COD' or 'ONLINE'
    total_amount NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    items JSONB NOT NULL,
    screenshot_url TEXT
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can place an order)
CREATE POLICY "Allow anonymous inserts" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Allow anonymous selects (so admin can view if they are not authenticated properly)
CREATE POLICY "Allow anonymous selects" ON public.orders
    FOR SELECT USING (true);
