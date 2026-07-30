import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const realProducts = [
  {
    slug: 'dry-skin-cream',
    name: 'Dry Skin & All Skin Type Cream',
    price: 1500,
    original_price: null,
    image: '/images/dry-skin.png',
    category: 'skin-care',
    rating: 5.0,
    reviews: 12,
    is_best_seller: true,
    is_new: false,
    in_stock: true,
    status: 'active',
    short_description: 'Deeply hydrating formula perfect for dry to normal skin types, restoring your natural barrier.',
    description: 'This rich, nourishing cream is formulated to provide intense hydration and lock in moisture for 24 hours. Ideal for dry skin but suitable for all skin types, it absorbs quickly without feeling greasy, leaving your skin plump and radiant.',
    benefits: ['Intense hydration', 'Restores skin barrier', 'Non-greasy finish', 'Suitable for daily use'],
    ingredients: ['Aloe Vera Extract', 'Hyaluronic Acid', 'Shea Butter', 'Vitamin E'],
    how_to_use: 'Apply a dime-sized amount to clean, dry skin morning and evening. Massage gently in upward circular motions.',
    variants: [{ value: '50g', label: '50g' }]
  },
  {
    slug: 'oil-control-mattifying',
    name: 'Oil Control & Mattifying Formula',
    price: 1200,
    original_price: 1500,
    image: '/images/oil-control.png',
    category: 'skin-care',
    rating: 4.8,
    reviews: 45,
    is_best_seller: true,
    is_new: false,
    in_stock: true,
    status: 'active',
    short_description: 'Lightweight formula that controls excess oil and leaves a smooth matte finish all day.',
    description: 'Say goodbye to midday shine. Our Oil Control & Mattifying Formula regulates sebum production while keeping your skin hydrated. It acts as a perfect primer under makeup or as a standalone daily moisturizer for oily and combination skin.',
    benefits: ['Controls excess oil', 'Minimizes pores', 'Matte finish', 'Prevents acne breakouts'],
    ingredients: ['Niacinamide', 'Tea Tree Oil', 'Witch Hazel', 'Zinc PCA'],
    how_to_use: 'After cleansing, apply a thin layer evenly across the face, focusing on the T-zone or oily areas. Use twice daily.',
    variants: [{ value: '50ml', label: '50ml' }]
  },
  {
    slug: 'pure-multani-mitti',
    name: 'Pure Multani Mitti',
    price: 800,
    original_price: null,
    image: '/images/multani-mitti.png',
    category: 'skin-care',
    rating: 4.9,
    reviews: 89,
    is_best_seller: true,
    is_new: false,
    in_stock: true,
    status: 'active',
    short_description: '100% pure and organic Fuller\'s Earth for a natural, glowing complexion.',
    description: 'Our Pure Multani Mitti (Fuller\'s Earth) is a time-tested herbal remedy for glowing skin. It deeply cleanses pores, removes blackheads, and improves blood circulation. Mix it with rose water, milk, or aloe vera for a customized face pack.',
    benefits: ['Deep pore cleansing', 'Brightens complexion', 'Treats acne and blemishes', 'Cooling effect on skin'],
    ingredients: ['100% Pure Multani Mitti (Fuller\'s Earth)'],
    how_to_use: 'Mix 1 tablespoon of powder with rose water or yogurt to form a smooth paste. Apply evenly to face and neck. Leave for 15 minutes and rinse with lukewarm water.',
    variants: [{ value: '100g', label: '100g' }, { value: '250g', label: '250g' }]
  },
  {
    slug: 'hair-reducing-mask',
    name: 'Unwanted Hair Reducing Mask',
    price: 1800,
    original_price: 2200,
    image: '/images/hair-reducing-mask.png',
    category: 'skin-care',
    rating: 4.7,
    reviews: 34,
    is_best_seller: false,
    is_new: true,
    in_stock: true,
    status: 'active',
    short_description: 'A natural, herbal blend that helps thin out and reduce the growth of unwanted facial and body hair over time.',
    description: 'Formulated with potent Ayurvedic herbs, this unique mask targets hair follicles to gradually weaken and reduce unwanted hair growth. With consistent use, hair becomes finer and sparser, while the skin is left smooth and nourished.',
    benefits: ['Reduces unwanted hair growth', 'Thins out hair over time', 'Gentle on sensitive skin', 'Natural alternative to harsh hair removal'],
    ingredients: ['Thanaka Powder', 'Kusuma Oil', 'Turmeric', 'Chickpea Flour'],
    how_to_use: 'Mix powder with water or milk to form a paste. Apply to the desired area in the direction of hair growth. Let it dry completely, then gently rub off in the opposite direction. Wash off with water. Use 2-3 times a week.',
    variants: [{ value: '100g', label: '100g' }]
  }
];

async function updateDb() {
  console.log('Deleting old products...');
  const { error: delErr } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.error('Failed to delete old products:', delErr);
    return;
  }
  
  console.log('Inserting new real products...');
  const { error: insErr } = await supabase.from('products').insert(realProducts);
  if (insErr) {
    console.error('Failed to insert new products:', insErr);
    return;
  }
  
  console.log('Database updated successfully with real products!');
}

updateDb();
