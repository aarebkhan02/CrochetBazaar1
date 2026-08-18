import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Heart, Search, ShoppingBag, Menu, X, ArrowRight, Plus, Minus, Trash2, Sparkles, PackageCheck, MessageCircle, Flower2, Gift, ShieldCheck, Instagram, Mail, Check, MinusCircle } from 'lucide-react';
import { products, categories, WHATSAPP_NUMBER, type Product } from '@/data/products';
import { useShop, type CartLine } from '@/hooks/use-shop';

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildWhatsAppMessage(lines: CartLine[], total: number, customer?: CheckoutData) {
  const items = lines.map((line) => `${line.product.name} × ${line.quantity} — ${money(line.product.price * line.quantity)}`).join('\n');
  return [
    'Hello CrochetBazaar!',
    '',
    'I would like to place an order:',
    items,
    '',
    `Total: ${money(total)}`,
    customer ? `Name: ${customer.name}\nMobile: ${customer.mobile}\nAddress: ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}` : '',
    'Payment: Cash on Delivery',
    '',
    'Please confirm my order. Thank you!',
  ].filter(Boolean).join('\n');
}

type CheckoutData = {
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  note: string;
};

const initialCheckout: CheckoutData = { name: '', mobile: '', address: '', city: '', state: '', pincode: '', note: '' };

function App() {
  const shop = useShop();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    return matchesCategory && (!term || `${product.name} ${product.category}`.toLowerCase().includes(term));
  }), [activeCategory, searchTerm]);
  const featuredProducts = products.filter((product) => product.featured);

  const openWhatsApp = (lines: CartLine[] = shop.cart, customer?: CheckoutData) => {
    if (!lines.length) return;
    const message = buildWhatsAppMessage(lines, shop.total, customer);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setConfirmation(true);
  };

  const addProduct = (product: Product) => {
    shop.addToCart(product);
    setCartOpen(true);
  };

  const buyProduct = (product: Product, quantity: number) => {
    shop.addToCart(product, quantity);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleCheckoutSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as unknown as CheckoutData;
    openWhatsApp(shop.cart, data);
    setCheckoutOpen(false);
  };

  return (
    <div className="shop-shell noise min-h-[100dvh]">
      <Announcement />
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.9)] backdrop-blur-xl">
        <div className="container-shop flex h-[4.5rem] items-center justify-between gap-5">
          <button className="flex items-center gap-2.5 text-left" onClick={() => scrollToId('home')} data-testid="button-brand-home" aria-label="Go to home">
            <span className="grid size-9 place-items-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
              <Flower2 size={19} strokeWidth={1.7} />
            </span>
            <span>
              <span className="block font-display text-[1.25rem] font-semibold leading-none">Crochet<span className="text-[hsl(var(--primary))]">Bazaar</span></span>
              <span className="eyebrow mt-1 block text-[hsl(var(--muted-foreground))]">little things, lovingly made</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[hsl(var(--muted-foreground))] md:flex" aria-label="Main navigation">
            <button onClick={() => scrollToId('home')} data-testid="link-home">Home</button>
            <button onClick={() => scrollToId('shop')} data-testid="link-shop">Shop</button>
            <button onClick={() => scrollToId('categories')} data-testid="link-categories">Categories</button>
            <button onClick={() => scrollToId('story')} data-testid="link-about">About</button>
            <button onClick={() => scrollToId('contact')} data-testid="link-contact">Contact</button>
          </nav>
          <div className="flex items-center gap-1">
            <button className="hidden size-10 place-items-center rounded-full hover:bg-[hsl(var(--muted))] sm:grid" onClick={() => scrollToId('shop')} data-testid="button-header-search" aria-label="Search products"><Search size={19} /></button>
            <button className="relative grid size-10 place-items-center rounded-full hover:bg-[hsl(var(--muted))]" onClick={() => setCartOpen(true)} data-testid="button-header-cart" aria-label={`Open cart with ${shop.itemCount} items`}>
              <ShoppingBag size={19} />
              {shop.itemCount > 0 && <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-[hsl(var(--primary))] px-1 text-[10px] font-bold text-white">{shop.itemCount}</span>}
            </button>
            <button className="grid size-10 place-items-center rounded-full bg-[hsl(var(--muted))] md:hidden" onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu" aria-label="Toggle menu">
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {mobileOpen && <nav className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-4 md:hidden" aria-label="Mobile navigation">
          {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => <button key={item} className="block w-full border-b border-[hsl(var(--border)/.65)] py-3 text-left text-sm font-semibold last:border-0" onClick={() => { setMobileOpen(false); scrollToId(item === 'Home' ? 'home' : item.toLowerCase()); }} data-testid={`mobile-link-${item.toLowerCase()}`}>{item}</button>)}
        </nav>}
      </header>

      <main>
        <section id="home" className="hero-grid relative">
          <div className="container-shop grid min-h-[690px] items-center gap-10 py-14 md:grid-cols-[1fr_.9fr] md:py-20">
            <div className="relative z-10 fade-up">
              <div className="eyebrow mb-5 flex items-center gap-3 text-[hsl(var(--primary))]"><span className="h-px w-8 bg-[hsl(var(--primary))]" /> made by one pair of hands</div>
              <h1 className="max-w-[650px] font-display text-[clamp(3.3rem,8vw,6.8rem)] font-semibold leading-[.91] tracking-[-.045em] text-[hsl(var(--foreground))]">Beautiful crochet,<br /><em className="text-[hsl(var(--primary))]">made with love.</em></h1>
              <p className="mt-7 max-w-[475px] text-lg leading-8 text-[hsl(var(--muted-foreground))]">Unique handmade flowers, gajras, bouquets and little accessories made specially for you.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button className="group flex items-center gap-3 rounded-full bg-[hsl(var(--primary))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))] transition hover:-translate-y-0.5" onClick={() => scrollToId('shop')} data-testid="button-hero-shop">Shop the little collection <ArrowRight size={17} className="transition group-hover:translate-x-1" /></button>
                <button className="rounded-full border border-[hsl(var(--foreground)/.22)] px-6 py-3.5 text-sm font-bold transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" onClick={() => scrollToId('categories')} data-testid="button-hero-collection">View collection</button>
              </div>
              <div className="mt-12 flex items-center gap-7 border-t border-[hsl(var(--foreground)/.12)] pt-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-2"><PackageCheck size={17} className="text-[hsl(var(--accent))]" /> COD available</span>
                <span className="flex items-center gap-2"><Sparkles size={17} className="text-[hsl(var(--primary))]" /> made to order</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[490px] md:justify-self-end">
              <div className="hero-blob absolute inset-5 bg-[hsl(var(--secondary)/.7)] md:inset-10" />
              <div className="relative aspect-[.86] overflow-hidden rounded-[48%_52%_45%_55%/42%_42%_58%_58%] border-[10px] border-[hsl(var(--card)/.8)] shadow-2xl shadow-[hsl(var(--primary)/.15)]">
                <img src={products[9].image} alt="Hand-held yellow and red crochet flower bouquet" className="h-full w-full object-cover" />
              </div>
              <div className="float-slow absolute -left-2 top-12 grid size-16 place-items-center rounded-full bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-xl shadow-[hsl(var(--foreground)/.1)] md:-left-7"><Flower2 size={28} strokeWidth={1.4} /></div>
              <div className="absolute -bottom-4 -right-1 rotate-3 rounded-2xl bg-[hsl(var(--accent))] px-5 py-3 text-[hsl(var(--accent-foreground))] shadow-xl md:right-0"><span className="eyebrow block opacity-70">the maker's note</span><span className="font-display text-lg">slow is beautiful.</span></div>
            </div>
          </div>
          <div className="absolute bottom-4 left-0 w-[200%] overflow-hidden border-y border-[hsl(var(--foreground)/.08)] py-3 text-[hsl(var(--primary)/.75)]"><div className="marquee flex w-max gap-12 text-xs font-bold uppercase tracking-[.24em]"><span>soft yarn · bright blooms · little joys · </span><span>soft yarn · bright blooms · little joys · </span><span>soft yarn · bright blooms · little joys · </span><span>soft yarn · bright blooms · little joys · </span></div></div>
        </section>

        <section id="featured" className="section-pad bg-[hsl(var(--background))]">
          <div className="container-shop">
            <SectionHeading kicker="a few favourites" title="The ones people keep coming back for." copy="Small, colourful reminders that the best things in life can be held in one hand." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} onAdd={() => addProduct(product)} isWishlisted={shop.wishlist.includes(product.id)} onWishlist={() => shop.toggleWishlist(product.id)} />)}</div>
          </div>
        </section>

        <section id="categories" className="section-pad bg-[hsl(var(--muted)/.6)]">
          <div className="container-shop">
            <SectionHeading kicker="browse by feeling" title="Find your kind of lovely." copy="From a single rose to a full bouquet, there is a little handmade moment for every kind of day." />
            <div className="mt-11 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {categories.map((category, index) => {
                const icon = [Flower2, Sparkles, Gift, Flower2, Flower2, Heart, PackageCheck][index];
                const Icon = icon;
                const active = activeCategory === category;
                return <button key={category} className={`group relative min-h-28 rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${active ? 'border-[hsl(var(--primary))] bg-[hsl(var(--card))] shadow-lg shadow-[hsl(var(--primary)/.1)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.55)]'}`} onClick={() => { setActiveCategory(category); scrollToId('shop'); }} data-testid={`button-category-${category.toLowerCase()}`}><Icon size={22} className={`mb-5 ${active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--accent))]'}`} strokeWidth={1.6} /><span className="block text-sm font-bold">{category}</span><span className="absolute right-3 top-3 text-xs text-[hsl(var(--muted-foreground))]">{category === 'All' ? products.length : products.filter((product) => product.category === category).length}</span></button>;
              })}
            </div>
          </div>
        </section>

        <section id="shop" className="section-pad bg-[hsl(var(--background))]">
          <div className="container-shop">
            <div className="flex flex-col justify-between gap-6 border-b border-[hsl(var(--border))] pb-8 sm:flex-row sm:items-end">
              <div><p className="eyebrow mb-3 text-[hsl(var(--primary))]">the full shelf</p><h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Made for keeping.</h2></div>
              <label className="flex w-full items-center gap-3 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 sm:w-72" data-testid="label-product-search"><Search size={17} className="text-[hsl(var(--muted-foreground))]" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search flowers, gajras..." className="w-full bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]" data-testid="input-product-search" /></label>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {categories.map((category) => <button key={category} className={`rounded-full px-4 py-2 text-xs font-bold transition ${activeCategory === category ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]'}`} onClick={() => setActiveCategory(category)} data-testid={`filter-${category.toLowerCase()}`}>{category}</button>)}
              <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">{filteredProducts.length} little things</span>
            </div>
            {filteredProducts.length > 0 ? <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} onAdd={() => addProduct(product)} isWishlisted={shop.wishlist.includes(product.id)} onWishlist={() => shop.toggleWishlist(product.id)} />)}</div> : <EmptyProducts onReset={() => { setSearchTerm(''); setActiveCategory('All'); }} />}
          </div>
        </section>

        <section className="section-pad bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
          <div className="container-shop grid gap-10 md:grid-cols-[.75fr_1.25fr] md:items-start">
            <div><p className="eyebrow mb-4 opacity-70">why this little shop</p><h2 className="font-display text-5xl font-semibold leading-[.98] sm:text-6xl">The charm is in the details.</h2></div>
            <div className="grid gap-8 sm:grid-cols-2">
              <WhyItem icon={<Sparkles />} title="100% handmade" copy="Every petal, leaf and loop is made carefully by hand." />
              <WhyItem icon={<Heart />} title="Made with care" copy="Thoughtful little pieces for gifting, keeping and celebrating." />
              <WhyItem icon={<PackageCheck />} title="COD available" copy="Pay when your parcel of happy arrives at your door." />
              <WhyItem icon={<MessageCircle />} title="Easy ordering" copy="A quick WhatsApp chat is all it takes to make it yours." />
            </div>
          </div>
        </section>

        <section id="story" className="section-pad bg-[hsl(var(--secondary)/.38)]">
          <div className="container-shop grid items-center gap-12 md:grid-cols-[.92fr_1.08fr]">
            <div className="relative mx-auto w-full max-w-[470px]">
              <div className="absolute -inset-4 rounded-[2rem] border border-[hsl(var(--primary)/.22)]" />
              <img src={products[10].image} alt="Handmade crochet bouquet held on a sunny balcony" className="relative aspect-[.94] w-full rounded-[1.75rem] object-cover shadow-xl" />
              <div className="absolute -bottom-7 -right-3 max-w-[175px] rounded-2xl bg-[hsl(var(--card))] p-4 shadow-xl"><Flower2 className="mb-3 text-[hsl(var(--primary))]" size={22} /><p className="font-display text-lg leading-tight">Made slowly, for your special moments.</p></div>
            </div>
            <div><p className="eyebrow mb-4 text-[hsl(var(--primary))]">our little story</p><h2 className="max-w-[500px] font-display text-5xl font-semibold leading-[1.02] sm:text-6xl">Made by hand,<br /><em className="text-[hsl(var(--primary))]">made for you.</em></h2><p className="mt-7 max-w-[500px] text-lg leading-8 text-[hsl(var(--muted-foreground))]">CrochetBazaar started with yarn, a hook, and the belief that a handmade gift feels different. Each flower and gajra is shaped by one maker, one careful loop at a time.</p><p className="mt-5 max-w-[500px] text-lg leading-8 text-[hsl(var(--muted-foreground))]">These are pieces for dressing up a corner, celebrating a person, or simply adding a little colour to an ordinary Tuesday.</p><button className="mt-8 flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]" onClick={() => scrollToId('shop')} data-testid="button-story-shop">See the handmade shelf <ArrowRight size={17} /></button></div>
          </div>
        </section>

        <Testimonials />
        <section id="contact" className="section-pad bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <div className="container-shop relative overflow-hidden rounded-[2rem] border border-white/20 bg-[hsl(var(--primary)/.45)] p-8 sm:p-14">
            <div className="absolute -right-10 -top-20 size-64 rounded-full border border-white/20" /><div className="absolute -right-20 -top-10 size-52 rounded-full border border-white/15" />
            <div className="relative max-w-[650px]"><p className="eyebrow mb-4 opacity-75">have a gifting thought?</p><h2 className="font-display text-5xl font-semibold leading-[.98] sm:text-6xl">Tell us what you’re imagining.</h2><p className="mt-6 max-w-lg text-lg leading-8 opacity-80">We love making little things personal. Start a conversation about colours, quantities or your next happy occasion.</p><button className="mt-8 flex items-center gap-3 rounded-full bg-[hsl(var(--card))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--foreground))] transition hover:-translate-y-0.5" onClick={() => openWhatsApp([{ product: products[9], quantity: 1 }])} data-testid="button-contact-whatsapp"><MessageCircle size={18} /> Order on WhatsApp <ArrowRight size={17} /></button></div>
          </div>
        </section>
      </main>

      <footer className="bg-[hsl(var(--foreground))] py-12 text-[hsl(var(--background))]">
        <div className="container-shop grid gap-10 md:grid-cols-[1.3fr_.7fr_.7fr]">
          <div><div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"><Flower2 size={19} /></span><span className="font-display text-2xl font-semibold">CrochetBazaar</span></div><p className="mt-5 max-w-xs text-sm leading-6 opacity-65">Hand-crocheted flowers, gajras and gifts from one small, happy studio.</p><div className="mt-6 flex gap-3"><button className="grid size-9 place-items-center rounded-full border border-white/20 opacity-75 hover:opacity-100" data-testid="button-instagram" aria-label="Instagram"><Instagram size={16} /></button><button className="grid size-9 place-items-center rounded-full border border-white/20 opacity-75 hover:opacity-100" data-testid="button-email" aria-label="Email"><Mail size={16} /></button></div></div>
          <div><p className="eyebrow mb-4 opacity-50">explore</p><div className="grid gap-3 text-sm opacity-75"><button className="text-left hover:opacity-100" onClick={() => scrollToId('home')} data-testid="footer-home">Home</button><button className="text-left hover:opacity-100" onClick={() => scrollToId('shop')} data-testid="footer-shop">Shop all</button><button className="text-left hover:opacity-100" onClick={() => scrollToId('story')} data-testid="footer-about">About the maker</button></div></div>
          <div><p className="eyebrow mb-4 opacity-50">good to know</p><div className="grid gap-3 text-sm opacity-75"><span>Cash on Delivery available</span><span>Made to order with care</span><button className="flex items-center gap-2 text-left hover:opacity-100" onClick={() => openWhatsApp([{ product: products[9], quantity: 1 }])} data-testid="footer-whatsapp"><MessageCircle size={15} /> Order on WhatsApp</button></div></div>
        </div>
        <div className="container-shop mt-10 border-t border-white/15 pt-5 text-xs opacity-50">© 2026 CrochetBazaar · little things, lovingly made.</div>
      </footer>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={buyProduct} onWhatsApp={() => openWhatsApp([{ product: selectedProduct, quantity: 1 }])} isWishlisted={shop.wishlist.includes(selectedProduct.id)} onWishlist={() => shop.toggleWishlist(selectedProduct.id)} />}
      {cartOpen && <CartDrawer cart={shop.cart} subtotal={shop.subtotal} delivery={shop.delivery} total={shop.total} updateQuantity={shop.updateQuantity} removeFromCart={shop.removeFromCart} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} onWhatsApp={() => openWhatsApp()} />}
      {checkoutOpen && <CheckoutModal cart={shop.cart} total={shop.total} onClose={() => setCheckoutOpen(false)} onSubmit={handleCheckoutSubmit} />}
      {confirmation && <ConfirmationModal onClose={() => { setConfirmation(false); shop.clearCart(); }} />}
    </div>
  );
}

function Announcement() {
  return <div className="bg-[hsl(var(--foreground))] px-4 py-2 text-center text-[11px] font-semibold tracking-[.08em] text-[hsl(var(--background))]">Free delivery on orders above ₹999 <span className="mx-2 opacity-40">·</span> COD available across India</div>;
}

function SectionHeading({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return <div className="max-w-xl"><p className="eyebrow mb-3 text-[hsl(var(--primary))]">{kicker}</p><h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{title}</h2><p className="mt-4 max-w-md text-[hsl(var(--muted-foreground))]">{copy}</p></div>;
}

function ProductCard({ product, onOpen, onAdd, isWishlisted, onWishlist }: { product: Product; onOpen: () => void; onAdd: () => void; isWishlisted: boolean; onWishlist: () => void }) {
  return <article className="product-card group relative" data-testid={`card-product-${product.id}`}>
    <div className="image-wash relative aspect-[.9] overflow-hidden rounded-2xl">
      <button className="absolute inset-0 z-10" onClick={onOpen} aria-label={`View ${product.name}`} data-testid={`button-view-${product.id}`} />
      <img src={product.image} alt={product.name} className="product-image h-full w-full object-cover" />
      <button className={`absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-[hsl(var(--card)/.9)] shadow-sm transition hover:scale-105 ${isWishlisted ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`} onClick={(event) => { event.stopPropagation(); onWishlist(); }} aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} data-testid={`button-wishlist-${product.id}`}>{isWishlisted ? <Heart size={17} fill="currentColor" /> : <Heart size={17} />}</button>
      {product.featured && <span className="absolute bottom-3 left-3 z-20 rounded-full bg-[hsl(var(--secondary))] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--foreground))]">favourite</span>}
    </div>
    <button className="mt-4 block text-left" onClick={onOpen} data-testid={`button-name-${product.id}`}><span className="eyebrow text-[hsl(var(--muted-foreground))]">{product.category}</span><h3 className="mt-1 font-display text-xl font-semibold">{product.name}</h3><p className="mt-1 font-semibold text-[hsl(var(--primary))]" data-testid={`text-price-${product.id}`}>{money(product.price)}</p></button>
    <div className="mt-4 flex gap-2"><button className="flex-1 rounded-full border border-[hsl(var(--border))] px-3 py-2.5 text-xs font-bold transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" onClick={onAdd} data-testid={`button-add-${product.id}`}>Add to cart</button><button className="grid size-10 place-items-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] transition hover:bg-[hsl(var(--primary))]" onClick={() => onOpen()} aria-label={`Buy ${product.name} now`} data-testid={`button-buy-${product.id}`}><ArrowRight size={16} /></button></div>
  </article>;
}

function EmptyProducts({ onReset }: { onReset: () => void }) {
  return <div className="mt-12 grid place-items-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/.45)] px-6 py-20 text-center"><MinusCircle className="text-[hsl(var(--primary))]" size={32} strokeWidth={1.5} /><h3 className="mt-4 font-display text-2xl font-semibold">Nothing in this little corner yet.</h3><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try another search or browse the full shelf.</p><button className="mt-5 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))]" onClick={onReset} data-testid="button-reset-products">Show everything</button></div>;
}

function WhyItem({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return <div className="border-t border-white/20 pt-5"><div className="mb-5 text-[hsl(var(--secondary))]">{icon}</div><h3 className="font-display text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 opacity-70">{copy}</p></div>;
}

function Testimonials() {
  const notes = [
    ['“Absolutely beautiful! The crochet flowers looked even better in person.”', 'Riya, Pune'],
    ['“Loved the gajra. It was so cute and beautifully made!”', 'Ananya, Jaipur'],
    ['“The bouquet was perfect for gifting. Highly recommended!”', 'Meera, Bengaluru'],
  ];
  return <section className="section-pad bg-[hsl(var(--background))]"><div className="container-shop"><SectionHeading kicker="kind words" title="Little notes from happy homes." copy="The nicest part of making these is hearing where they end up." /><div className="mt-12 grid gap-4 md:grid-cols-3">{notes.map(([quote, name], index) => <article key={name} className={`rounded-2xl p-6 ${index === 1 ? 'bg-[hsl(var(--secondary)/.48)]' : 'bg-[hsl(var(--muted)/.55)]'}`}><div className="mb-8 flex gap-1 text-[hsl(var(--primary))]">{[1, 2, 3, 4, 5].map((star) => <Sparkles size={13} key={star} fill="currentColor" />)}</div><p className="font-display text-2xl leading-tight">{quote}</p><p className="mt-7 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{name}</p></article>)}</div></div></section>;
}

function ProductModal({ product, onClose, onAdd, onWhatsApp, isWishlisted, onWishlist }: { product: Product; onClose: () => void; onAdd: (product: Product, quantity: number) => void; onWhatsApp: () => void; isWishlisted: boolean; onWishlist: () => void }) {
  const [quantity, setQuantity] = useState(1);
  return <div className="modal-backdrop fixed inset-0 z-50 grid place-items-end bg-[hsl(var(--foreground)/.55)] p-0 sm:place-items-center sm:p-5" onClick={onClose}>
    <div className="modal-card relative max-h-[94dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-[hsl(var(--card))] sm:max-w-3xl sm:rounded-[1.75rem]" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${product.name} details`}>
      <button className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-[hsl(var(--card)/.85)] shadow" onClick={onClose} data-testid="button-close-product"><X size={18} /></button>
      <div className="grid md:grid-cols-2"><div className="image-wash aspect-square md:aspect-auto"><img src={product.image} alt={product.name} className="h-full max-h-[520px] w-full object-cover" /></div><div className="p-6 sm:p-9"><p className="eyebrow text-[hsl(var(--primary))]">{product.category}</p><div className="mt-2 flex items-start justify-between gap-4"><h2 className="font-display text-4xl font-semibold leading-none">{product.name}</h2><button className="text-[hsl(var(--primary))]" onClick={onWishlist} aria-label="Toggle wishlist" data-testid="button-modal-wishlist">{isWishlisted ? <Heart fill="currentColor" /> : <Heart />}</button></div><p className="mt-4 text-xl font-semibold text-[hsl(var(--primary))]">{money(product.price)}</p><p className="mt-6 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{product.description}</p><div className="mt-8 flex items-center justify-between rounded-xl border border-[hsl(var(--border))] px-3 py-2"><span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Quantity</span><div className="flex items-center gap-3"><button className="grid size-8 place-items-center rounded-full bg-[hsl(var(--muted))]" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" data-testid="button-modal-decrease"><Minus size={15} /></button><span className="w-5 text-center font-bold" data-testid="text-modal-quantity">{quantity}</span><button className="grid size-8 place-items-center rounded-full bg-[hsl(var(--muted))]" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity" data-testid="button-modal-increase"><Plus size={15} /></button></div></div><button className="mt-4 w-full rounded-full bg-[hsl(var(--primary))] py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]" onClick={() => onAdd(product, quantity)} data-testid="button-modal-add">Add to cart</button><button className="mt-2 w-full rounded-full border border-[hsl(var(--foreground)/.22)] py-3.5 text-sm font-bold" onClick={() => { onAdd(product, quantity); }} data-testid="button-modal-buy">Buy now</button><button className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-[hsl(var(--accent))]" onClick={onWhatsApp} data-testid="button-modal-whatsapp"><MessageCircle size={17} /> Order this on WhatsApp</button><p className="mt-5 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"><ShieldCheck size={15} className="text-[hsl(var(--accent))]" /> Cash on Delivery — pay when your parcel arrives.</p></div></div>
    </div>
  </div>;
}

function CartDrawer({ cart, subtotal, delivery, total, updateQuantity, removeFromCart, onClose, onCheckout, onWhatsApp }: { cart: CartLine[]; subtotal: number; delivery: number; total: number; updateQuantity: (id: string, quantity: number) => void; removeFromCart: (id: string) => void; onClose: () => void; onCheckout: () => void; onWhatsApp: () => void }) {
  return <div className="modal-backdrop fixed inset-0 z-50 bg-[hsl(var(--foreground)/.55)]" onClick={onClose}><aside className="modal-card absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[hsl(var(--card))]" onClick={(event) => event.stopPropagation()} aria-label="Shopping cart"><div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-5"><div><p className="eyebrow text-[hsl(var(--primary))]">your parcel</p><h2 className="font-display text-3xl font-semibold">Shopping cart</h2></div><button className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" onClick={onClose} data-testid="button-close-cart"><X size={18} /></button></div>
    {cart.length ? <><div className="flex-1 space-y-4 overflow-y-auto p-5">{cart.map((line) => <div className="flex gap-3" key={line.product.id} data-testid={`cart-line-${line.product.id}`}><img src={line.product.image} alt={line.product.name} className="size-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><div><p className="font-display text-lg leading-tight">{line.product.name}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{money(line.product.price)} each</p></div><button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]" onClick={() => removeFromCart(line.product.id)} aria-label={`Remove ${line.product.name}`} data-testid={`button-remove-${line.product.id}`}><Trash2 size={15} /></button></div><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-2 rounded-full bg-[hsl(var(--muted))] p-1"><button className="grid size-6 place-items-center rounded-full bg-[hsl(var(--card))]" onClick={() => updateQuantity(line.product.id, line.quantity - 1)} aria-label="Decrease quantity" data-testid={`button-cart-minus-${line.product.id}`}><Minus size={13} /></button><span className="w-5 text-center text-xs font-bold">{line.quantity}</span><button className="grid size-6 place-items-center rounded-full bg-[hsl(var(--card))]" onClick={() => updateQuantity(line.product.id, line.quantity + 1)} aria-label="Increase quantity" data-testid={`button-cart-plus-${line.product.id}`}><Plus size={13} /></button></div><span className="text-sm font-bold">{money(line.product.price * line.quantity)}</span></div></div></div>)}</div><div className="border-t border-[hsl(var(--border))] p-5"><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Delivery</span><span>{delivery ? money(delivery) : 'Free'}</span></div><div className="flex justify-between border-t border-[hsl(var(--border))] pt-3 text-base font-bold"><span>Total</span><span className="text-[hsl(var(--primary))]" data-testid="text-cart-total">{money(total)}</span></div></div><p className="mt-4 flex items-center gap-2 rounded-xl bg-[hsl(var(--accent)/.1)] p-3 text-xs text-[hsl(var(--accent))]"><PackageCheck size={16} /> Cash on Delivery · pay when delivered</p><button className="mt-4 w-full rounded-full bg-[hsl(var(--primary))] py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]" onClick={onCheckout} data-testid="button-cart-checkout">Continue to checkout</button><button className="mt-2 flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-[hsl(var(--accent))]" onClick={onWhatsApp} data-testid="button-cart-whatsapp"><MessageCircle size={16} /> Order on WhatsApp</button></div></> : <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><div className="grid size-20 place-items-center rounded-full bg-[hsl(var(--secondary)/.6)] text-[hsl(var(--primary))]"><ShoppingBag size={30} strokeWidth={1.4} /></div><h3 className="mt-5 font-display text-2xl font-semibold">Your parcel is still empty.</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">Add something colourful and handmade to get started.</p><button className="mt-6 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" onClick={onClose} data-testid="button-empty-cart-shop">Browse the shelf</button></div>}</aside></div>;
}

function CheckoutModal({ cart, total, onClose, onSubmit }: { cart: CartLine[]; total: number; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-[hsl(var(--foreground)/.55)] p-0 sm:p-5" onClick={onClose}><div className="modal-card mx-auto min-h-full max-w-4xl bg-[hsl(var(--card))] p-5 sm:my-8 sm:min-h-0 sm:rounded-[1.75rem] sm:p-9" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Cash on delivery checkout"><div className="flex items-start justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">almost yours</p><h2 className="font-display text-4xl font-semibold">Where should we send it?</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">We’ll open WhatsApp with your order details ready to send.</p></div><button className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" onClick={onClose} data-testid="button-close-checkout"><X size={18} /></button></div><form className="mt-8 grid gap-8 md:grid-cols-[1.1fr_.9fr]" onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="name" placeholder="Your name" required /><Field label="Mobile number" name="mobile" placeholder="10-digit number" type="tel" required /><Field label="Delivery address" name="address" placeholder="House, street, area" required wide /><Field label="City" name="city" placeholder="Your city" required /><Field label="State" name="state" placeholder="Your state" required /><Field label="Pincode" name="pincode" placeholder="6-digit pincode" required /><Field label="Order note" name="note" placeholder="Any colour or gifting notes?" wide /></div><div className="rounded-2xl bg-[hsl(var(--muted)/.55)] p-5"><p className="eyebrow text-[hsl(var(--muted-foreground))]">order summary</p><div className="mt-5 space-y-3">{cart.map((line) => <div className="flex justify-between gap-3 text-sm" key={line.product.id}><span>{line.product.name} <span className="text-[hsl(var(--muted-foreground))]">× {line.quantity}</span></span><span className="font-semibold">{money(line.product.price * line.quantity)}</span></div>)}</div><div className="mt-5 border-t border-[hsl(var(--border))] pt-4"><div className="flex justify-between font-bold"><span>Total</span><span className="text-[hsl(var(--primary))]" data-testid="text-checkout-total">{money(total)}</span></div></div><div className="mt-5 rounded-xl border border-[hsl(var(--accent)/.25)] bg-[hsl(var(--accent)/.08)] p-4"><p className="flex items-center gap-2 text-sm font-bold text-[hsl(var(--accent))]"><ShieldCheck size={16} /> Cash on Delivery</p><p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Pay when your order is delivered. No online payment needed.</p></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]" type="submit" data-testid="button-place-order"><MessageCircle size={17} /> Place order on WhatsApp</button></div></form></div></div>;
}

function Field({ label, name, placeholder, type = 'text', required = false, wide = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean; wide?: boolean }) {
  return <label className={`grid gap-1.5 text-xs font-bold ${wide ? 'sm:col-span-2' : ''}`} htmlFor={name}>{label}{required && <span className="text-[hsl(var(--primary))]"> *</span>}<input className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm font-normal outline-none transition focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/.15)]" id={name} name={name} placeholder={placeholder} type={type} required={required} data-testid={`input-checkout-${name}`} /></label>;
}

function ConfirmationModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop fixed inset-0 z-[60] grid place-items-center bg-[hsl(var(--foreground)/.55)] p-5"><div className="modal-card w-full max-w-md rounded-[1.75rem] bg-[hsl(var(--card))] p-8 text-center sm:p-10"><div className="mx-auto grid size-16 place-items-center rounded-full bg-[hsl(var(--accent)/.14)] text-[hsl(var(--accent))]"><Check size={30} /></div><h2 className="mt-6 font-display text-4xl font-semibold leading-none">Your order details are ready.</h2><p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">Please send the WhatsApp message to confirm your Cash on Delivery order.</p><button className="mt-7 w-full rounded-full bg-[hsl(var(--primary))] py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]" onClick={onClose} data-testid="button-continue-shopping">Continue shopping</button></div></div>;
}

export default App;