export type Category = "Politics" | "Business" | "Technology" | "Sports" | "Entertainment" | "Local" | "International";
export type Language = "en" | "hi";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  language: Language;
  author: string;
  publishDate: string;
  readTime: number;
  imageUrl: string;
  isBreaking: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
}

export const categories: Category[] = [
  "Politics", "Business", "Technology", "Sports", "Entertainment", "Local", "International"
];

export const sampleArticles: Article[] = [
  {
    id: "1",
    title: "India Launches New Digital Infrastructure Initiative",
    excerpt: "The government announces a ₹50,000 crore plan to modernize digital infrastructure across rural India.",
    content: `The Indian government has unveiled a landmark ₹50,000 crore initiative aimed at revolutionizing digital infrastructure across the country's rural regions. This ambitious project, announced by the Ministry of Electronics and IT, seeks to bridge the digital divide that has long separated urban and rural India.\n\nThe initiative encompasses the deployment of high-speed fiber optic networks to over 250,000 villages, establishment of 100,000 digital literacy centers, and the creation of a robust cloud computing backbone to support e-governance services.\n\n"This is not just about connectivity — it's about empowerment," said the Minister of Electronics and IT at a press conference in New Delhi. "Every citizen, regardless of their location, deserves access to the digital economy."\n\nKey components of the initiative include:\n- Fiber optic connectivity to 250,000+ villages by 2027\n- 100,000 digital literacy centers in rural areas\n- AI-powered agricultural advisory services\n- Telemedicine platforms for remote healthcare\n- Digital payment infrastructure expansion\n\nIndustry experts have lauded the move, calling it a "game-changer" for India's digital transformation journey. The project is expected to create over 500,000 direct jobs and countless indirect employment opportunities.`,
    category: "Technology",
    language: "en",
    author: "Rajesh Kumar",
    publishDate: "2026-02-12",
    readTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    isBreaking: true,
    isFeatured: true,
    views: 15420,
    likes: 892,
  },
  {
    id: "2",
    title: "भारत ने जीता एशिया कप 2026",
    excerpt: "रोहित शर्मा की शानदार कप्तानी में भारत ने पाकिस्तान को फाइनल में हराकर एशिया कप जीता।",
    content: `भारतीय क्रिकेट टीम ने एशिया कप 2026 के फाइनल में पाकिस्तान को 7 विकेट से हराकर खिताब अपने नाम किया। कप्तान रोहित शर्मा ने 87 गेंदों में शानदार 112 रन बनाए।\n\nपहले बल्लेबाजी करते हुए पाकिस्तान ने 50 ओवर में 287 रन बनाए। जवाब में भारत ने 46.3 ओवर में 3 विकेट खोकर लक्ष्य हासिल कर लिया।\n\nमैन ऑफ द मैच रोहित शर्मा ने कहा, "यह जीत पूरी टीम की मेहनत का नतीजा है। हमने शुरू से ही योजना के अनुसार खेला।"`,
    category: "Sports",
    language: "hi",
    author: "अमित शर्मा",
    publishDate: "2026-02-11",
    readTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    isBreaking: false,
    isFeatured: true,
    views: 23100,
    likes: 1540,
  },
  {
    id: "3",
    title: "Stock Market Hits All-Time High as Sensex Crosses 95,000",
    excerpt: "Indian markets rally on strong Q3 earnings and FII inflows, with Sensex breaching the historic 95,000 mark.",
    content: `The Bombay Stock Exchange's benchmark index Sensex crossed the 95,000 mark for the first time in history, driven by robust quarterly earnings and sustained foreign institutional investor (FII) inflows.\n\nThe rally was led by IT and banking stocks, with TCS, Infosys, and HDFC Bank among the top gainers. The broader market also participated, with the Nifty 50 crossing 28,500 levels.\n\nMarket analysts attribute the surge to multiple factors including strong corporate earnings, stable macroeconomic indicators, and positive global sentiment. India's GDP growth at 7.2% has made it one of the most attractive emerging markets for global investors.`,
    category: "Business",
    language: "en",
    author: "Priya Mehta",
    publishDate: "2026-02-11",
    readTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    isBreaking: true,
    isFeatured: false,
    views: 18700,
    likes: 672,
  },
  {
    id: "4",
    title: "New Education Policy 2026: Major Reforms Announced",
    excerpt: "The Ministry of Education introduces sweeping changes focusing on AI literacy and vocational training from Class 6.",
    content: `In a significant overhaul of the education framework, the Ministry of Education has announced major reforms under the New Education Policy 2026. The reforms focus on integrating artificial intelligence literacy into the curriculum starting from Class 6 and expanding vocational training programs.\n\nKey highlights include mandatory coding and AI basics from Class 6, partnerships with tech companies for practical training, and a new credit-based system for higher education that allows students to switch between universities seamlessly.`,
    category: "Politics",
    language: "en",
    author: "Sunita Desai",
    publishDate: "2026-02-10",
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    isBreaking: false,
    isFeatured: false,
    views: 9800,
    likes: 445,
  },
  {
    id: "5",
    title: "बॉलीवुड: शाहरुख खान की नई फिल्म ने तोड़े सभी रिकॉर्ड",
    excerpt: "शाहरुख खान की नई एक्शन थ्रिलर ने पहले सप्ताह में ₹500 करोड़ की कमाई की।",
    content: `बॉलीवुड के किंग शाहरुख खान की नई फिल्म ने बॉक्स ऑफिस पर तहलका मचा दिया है। फिल्म ने रिलीज़ के पहले सप्ताह में ₹500 करोड़ से अधिक की कमाई कर सभी पुराने रिकॉर्ड तोड़ दिए हैं।\n\nफिल्म को दर्शकों और समीक्षकों दोनों से शानदार प्रतिक्रिया मिली है। इसे IMDB पर 8.5 की रेटिंग मिली है।`,
    category: "Entertainment",
    language: "hi",
    author: "करण जोशी",
    publishDate: "2026-02-10",
    readTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
    isBreaking: false,
    isFeatured: false,
    views: 31200,
    likes: 2100,
  },
  {
    id: "6",
    title: "Climate Summit 2026: India Pledges Carbon Neutrality by 2060",
    excerpt: "At the Global Climate Summit, India announces an accelerated timeline for achieving carbon neutrality.",
    content: `India has made a bold commitment at the Global Climate Summit 2026, pledging to achieve carbon neutrality by 2060 — a decade earlier than its previous target. The announcement was met with widespread acclaim from international leaders and environmental organizations.\n\nThe revised plan includes massive investments in renewable energy, with a target of 500 GW of non-fossil fuel capacity by 2035, along with a complete phase-out of single-use plastics by 2028.`,
    category: "International",
    language: "en",
    author: "Ananya Roy",
    publishDate: "2026-02-09",
    readTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800",
    isBreaking: false,
    isFeatured: false,
    views: 7600,
    likes: 390,
  },
  {
    id: "7",
    title: "Delhi Metro Phase 5 Expansion Plan Approved",
    excerpt: "Delhi Metro's Phase 5 will add 150 km of new routes connecting NCR suburbs to the city center.",
    content: `The Delhi Metro Rail Corporation (DMRC) has received approval for its ambitious Phase 5 expansion plan, which will add 150 kilometers of new metro routes connecting key suburbs in the National Capital Region to the city center.\n\nThe expansion includes three new corridors, 45 new stations, and integration with regional rapid transit systems. The project is estimated to cost ₹35,000 crore and is expected to be completed by 2031.`,
    category: "Local",
    language: "en",
    author: "Vikram Singh",
    publishDate: "2026-02-09",
    readTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    isBreaking: false,
    isFeatured: false,
    views: 5400,
    likes: 210,
  },
  {
    id: "8",
    title: "AI Startup from Bangalore Raises $200 Million in Series C",
    excerpt: "Bangalore-based AI company secures massive funding to expand its natural language processing platform globally.",
    content: `A Bangalore-based artificial intelligence startup has raised $200 million in its Series C funding round, led by Sequoia Capital and Tiger Global. The company's natural language processing platform supports 22 Indian languages and is used by over 500 enterprises.\n\nThe funds will be used to expand into Southeast Asian and Middle Eastern markets, hire 1,000 new engineers, and develop next-generation AI models specifically designed for multilingual applications.`,
    category: "Technology",
    language: "en",
    author: "Deepak Nair",
    publishDate: "2026-02-08",
    readTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    isBreaking: false,
    isFeatured: false,
    views: 12300,
    likes: 567,
  },
];
