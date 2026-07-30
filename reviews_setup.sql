-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can place a review)
CREATE POLICY "Allow anonymous inserts" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Allow anonymous selects (so everyone can see reviews)
CREATE POLICY "Allow anonymous selects" ON public.reviews
    FOR SELECT USING (true);
