

# 🚀 NewsNova — AI-Powered Smart News Platform

## Overview
A modern, bilingual (English + Hindi) news platform where you manually publish articles, and readers get an AI-enhanced reading experience. Built as a web app — perfect for your BSc CS portfolio.

---

## Phase 1: Core News Platform (Foundation)

### 🏠 Homepage
- **Hero section** with breaking/featured news banner (large card with image)
- **Category tabs**: Politics, Business, Technology, Sports, Entertainment, Local, International
- **Card-based news grid** with infinite scroll
- **Trending sidebar** showing most-read articles
- **Breaking News badge** on urgent articles
- Dark Blue (#1E3A8A) + Red (#DC2626) theme with yellow accents for breaking news
- **Dark mode / Light mode** toggle

### 📰 Article Page
- Full article view with large header image
- Title, author name, publish date, read time estimate
- Clean reading mode with font size adjustment
- Like, Bookmark, Share buttons
- Related articles section at the bottom
- Support for both English and Hindi content

### 🔍 Search & Filter
- Keyword search across all articles
- Filter by category, date, and language (English/Hindi)
- Trending filter (most read)

### 📱 Responsive Design
- Mobile-first card-based layout
- Bottom navigation on mobile (Home, Categories, Trending, Saved, Search)
- Top navbar with mega menu on desktop
- Smooth animations using Tailwind + CSS transitions
- Poppins/Montserrat for headlines, Inter for body text

---

## Phase 2: Admin Panel (Content Management)

### ✍️ Article Management
- Add new articles with rich text editor
- Upload header images
- Set category, language (English/Hindi), and breaking news flag
- Edit and delete existing articles
- Schedule articles for future publish dates

### 📊 Simple Analytics Dashboard
- Total articles published
- View counts per article
- Top categories by views
- Simple charts using Recharts

*Note: Admin access will be a simple route — no login system for now, as you chose public-only access.*

---

## Phase 3: AI Features (Portfolio Highlight ⭐)

### 🤖 AI News Summarizer
- "Quick Read" button on every article
- Generates a 5-line summary using Lovable AI
- Shows summary in a collapsible card above the article

### 💬 AI News Chatbot
- "Ask about this news" floating button on article pages
- Chat drawer where users can ask questions like "What's the impact on India?"
- Context-aware — sends the article content to AI for relevant answers
- Streaming responses for real-time feel

### 🔊 AI Voice Reader (Text-to-Speech)
- "Listen" button on articles
- Reads the article aloud using ElevenLabs TTS
- Support for English and Hindi voices
- Play/pause controls

### 🛡️ Fake News Credibility Score (Simulated)
- Each article shows a credibility badge (Verified/Unverified)
- AI analyzes article text and provides a trust score with reasoning
- Visual indicator (green/yellow/red badge)

---

## Phase 4: Social & Engagement Features

### 💬 Comments Section
- Simple comment system on each article (stored locally or in database)
- Display commenter name + comment text

### 📌 Bookmarks & Saved Articles
- Save articles to a "Saved" section (using browser localStorage since no auth)
- Dedicated saved articles page

### 🔔 Breaking News Banner
- Auto-scrolling breaking news ticker at the top of the homepage

---

## Backend Requirements
- **Lovable Cloud** for database (articles, categories, comments, view counts)
- **Lovable AI** for summarizer, chatbot, and credibility scoring
- **ElevenLabs connector** for text-to-speech voice reading
- Edge functions for AI and TTS processing

---

## What Makes This Portfolio-Worthy
- Real AI integration (not mock) — summarizer, chatbot, TTS, credibility analysis
- Bilingual content support (English + Hindi)
- Clean, professional UI with dark mode
- Content management system you built yourself
- Modern tech stack: React, TypeScript, Tailwind, Supabase

