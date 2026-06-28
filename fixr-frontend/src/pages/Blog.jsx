import { useState } from 'react';
import { Link } from 'react-router-dom';

const POSTS = [
  {
    id: 1,
    tag: 'Platform News',
    tagColor: 'bg-primary/20 text-primary',
    title: 'FIXR hits 50,000 registered users across East Africa',
    excerpt: 'Less than 18 months after launch, FIXR has become East Africa\'s fastest-growing work platform — driven by gig workers, farmers, and diaspora professionals.',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format&q=80',
    author: 'Amara Osei',
    authorImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format&q=80',
    date: 'May 28, 2025',
    readTime: '3 min read',
    featured: true,
  },
  {
    id: 2,
    tag: 'Tips & Guides',
    tagColor: 'bg-accent/20 text-accent',
    title: 'How to land your first gig on FIXR in under 48 hours',
    excerpt: 'A step-by-step guide to optimising your profile, writing a killer cover note, and standing out from the crowd — even with no reviews yet.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&auto=format&q=80',
    author: 'David Kimani',
    authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=80',
    date: 'May 14, 2025',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 3,
    tag: 'AI & Tech',
    tagColor: 'bg-purple-500/20 text-purple-300',
    title: 'Behind the scenes: How our AI CV Builder works',
    excerpt: 'We built an AI tool that writes professional CVs from your FIXR profile. Here\'s the technical story — and why we made it completely free.',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&auto=format&q=80',
    author: 'Fatima Al-Hassan',
    authorImg: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&auto=format&q=80',
    date: 'May 2, 2025',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 4,
    tag: 'Community',
    tagColor: 'bg-green-500/20 text-green-300',
    title: 'FIXR for Farmers: Connecting cooperatives to buyers across Kenya',
    excerpt: 'We sat down with three farming cooperatives in the Rift Valley to learn how FIXR is changing how they sell produce and find labour.',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&auto=format&q=80',
    author: 'Brian Mwangi',
    authorImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format&q=80',
    date: 'Apr 20, 2025',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 5,
    tag: 'Payments',
    tagColor: 'bg-blue-500/20 text-blue-300',
    title: 'M-Pesa integration deep-dive: Instant payouts for gig workers',
    excerpt: 'How we integrated Safaricom Daraja to deliver instant M-Pesa payouts — and why this is a game-changer for informal workers without bank accounts.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format&q=80',
    author: 'David Kimani',
    authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=80',
    date: 'Apr 8, 2025',
    readTime: '4 min read',
    featured: false,
  },
];

const TAGS = ['All', 'Platform News', 'Tips & Guides', 'AI & Tech', 'Community', 'Payments'];

export default function Blog() {
  const [activeTag, setActiveTag] = useState('All');
  const featured = POSTS[0];
  const rest = POSTS.slice(1).filter(p => activeTag === 'All' || p.tag === activeTag);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="text-center py-16 px-6">
        <span className="badge bg-primary/20 text-primary border border-primary/30 mb-5 inline-block">📰 FIXR Blog</span>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Stories from the platform</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">News, guides, and insights from the FIXR team and community.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Featured post */}
        <Link to={`/blog/${featured.id}`} className="group block mb-12">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] border border-gray-800 group-hover:border-accent/40 transition">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${featured.tagColor}`}>{featured.tag}</span>
                <span className="text-gray-400 text-xs">{featured.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 max-w-2xl">
                {featured.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-6 hidden sm:block">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3">
                <img src={featured.authorImg} alt={featured.author} className="w-8 h-8 rounded-full object-cover border-2 border-accent/40" />
                <span className="text-gray-300 text-sm font-medium">{featured.author}</span>
                <span className="text-gray-500 text-sm">· {featured.date}</span>
              </div>
            </div>
            <div className="absolute top-6 right-6 bg-accent text-dark text-xs font-black px-3 py-1 rounded-full">
              Featured
            </div>
          </div>
        </Link>

        {/* Tag filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeTag === t ? 'bg-primary border-primary text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {rest.map(post => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group card !p-0 overflow-hidden flex flex-col">
              <div className="relative h-52 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <span className={`absolute top-3 left-3 badge ${post.tagColor}`}>{post.tag}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-base leading-snug mb-2 group-hover:text-accent transition">{post.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
                  <img src={post.authorImg} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-gray-400 text-xs">{post.author}</span>
                  <span className="text-gray-600 text-xs ml-auto">{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=400&fit=crop&auto=format&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          <div className="relative z-10 bg-gray-900/80 border border-gray-800 rounded-2xl p-10 text-center">
            <h3 className="text-2xl font-black mb-2">Stay in the loop</h3>
            <p className="text-gray-400 mb-6 text-sm">Get FIXR stories, platform updates, and work tips in your inbox.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com" className="input flex-1" />
              <button className="btn-accent flex-shrink-0">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
