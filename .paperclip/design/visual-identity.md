# Dostel Visual Identity Guidelines

## Logo Usage
Since no official logo asset is currently provided, the placeholder "D" tile/wordmark should be treated as interim. When assets become available:
- Primary logo: Mountain-inspired wordmark with Dostel in Playfair Display
- Secondary logo: Simplified "D" mark for favicons and app icons
- Clear space: Equal to height of lowercase "d" in wordmark
- Minimum size: 32px height for digital applications

## Color Application
Primary palette usage rules:
- Forest-900: Primary text, headers, navigation
- Forest-500: Interactive states, links, active elements
- Sunset: Primary CTAs, highlight elements, rating stars
- Snow: Page backgrounds, card surfaces, modal backdrops
- Sky: Info states, trust indicators, secondary accents
- Earth: Decorative elements, subtle highlights, secondary text on dark backgrounds
- Stone-600: Body text, secondary information
- Stone-200: Dividers, subtle borders, input fields
- White: Card surfaces, modals, overlay backgrounds
- Error: Destructive actions, form validation errors
- Success: Confirmation states, positive feedback

## Typography Hierarchy
- Hero/Display (2.5rem): Page titles, hero sections
- Section Headings (2rm): Major content sections
- Card Titles (1.5rem): Property names, room types, modal headers
- Body Text (1rem): Paragraphs, descriptions, form labels
- Captions (0.875rem): Metadata, timestamps, auxiliary info
- Labels/Badges (0.75rem): Form labels, status badges, compact info

All headings use Playfair Display; body and UI use Inter.

## Imagery Style
Photography should reflect:
- Authentic community moments (not staged stock photos)
- Mountain environment: mist, forests, trails, local architecture
- Diverse travelers engaging in genuine interactions
- Warm, natural lighting (golden hour preferred)
- Documentary-style candid shots over polished commercial imagery
- Focus on experiences over amenities

Avoid:
- Generic hotel/resort stock photography
- Overly staged or artificial scenes
- Cold, corporate aesthetics
- Excessive use of filters or artificial color grading

## Iconography System
- Use custom SVGs for core UI actions (check, calendar, map pin, etc.)
- 24x24px for primary action icons
- 20x20px for metadata icons (ratings, amenities)
- Stroke width: 2px for consistency
- Color application:
  - Forest-500: Primary action icons
  - Stone-600: Secondary/metadata icons
  - Sunset: Interactive states, rating stars
  - White: Icons on dark backgrounds
- No emoji icons in UI components (reserved for marketing/social content only)

## Motion Principles
Three prescribed animations only:
1. Card hover lift: Indicates interactivity on tappable/clickable elements
2. Page fade-in: Provides continuity between views
3. Button press: Gives tactile feedback for actions

Motion should:
- Serve a clear purpose (feedback, orientation, attention)
- Never be decorative or distracting
- Respect prefers-reduced-motion settings
- Performance-tested on low-end devices

## Voice & Tone in UI
Language should be:
- Warm and welcoming ("Welcome back" vs "User logged in")
- Community-focused ("Join Dostellers" vs "Sign up")
- Place-specific ("Vattakanal trails" vs "Local attractions")
- Clear and action-oriented ("Select room" vs "Proceed")
- Helpful and informative without being technical

Avoid:
- Corporate jargon ("leverage", "synergy", "optimize")
- Generic placeholder text ("Lorem ipsum", "Enter text here")
- Overly promotional language ("amazing!", "incredible deal!")
- Technical terms in user-facing copy ("API", "endpoint", "database")

## Accessibility Implementation
All components must meet:
- Minimum 4.5:1 contrast ratio for text
- 44x44px minimum touch targets
- Logical tab ordering following DOM structure
- Visible focus indicators (2px solid Sky-500)
- Proper ARIA labels for icon-only buttons
- Semantic HTML structure (headings, landmarks, lists)
- Error messages associated with fields via aria-describedby
- Live regions for dynamic status updates