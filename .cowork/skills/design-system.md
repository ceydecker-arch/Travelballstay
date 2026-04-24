# TravelBallStay Design System

## Colors — Use These Exactly
Primary pine green: #2D6A4F
Light green bg: #e8f5ee
Mid green: #3a8c64
Dark green: #1f4d38
Green border: #a8d5be
Accent amber: #f59e0b
Amber light bg: #fef3c7
Dark navy: #0f1f2e
Background: #f5f8fa
White: #ffffff
Muted text: #5a7080
Border color: #dde8ee

## Three Color Logo — Always Use This
```tsx
<div className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-lg flex items-center 
    justify-center" style={{backgroundColor: '#2D6A4F'}}>
    <MapPin size={16} color="white" strokeWidth={2.5} />
  </div>
  <span className="text-xl font-extrabold tracking-tight">
    <span style={{color: '#0f1f2e'}}>Travel</span>
    <span style={{color: '#2D6A4F'}}>Ball</span>
    <span style={{color: '#f59e0b'}}>Stay</span>
  </span>
</div>
```

## Page Structure Rules
Every inner page must have:
1. Navbar at top (components/Navbar.tsx)
2. Dark navy hero header with amber accent
3. Content on #f5f8fa background
4. Footer not required on inner pages

## Button Styles
Primary button:
- background: linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)
- box-shadow: 0 4px 14px rgba(45,106,79,0.4)
- color: white, rounded-xl, px-6 py-3, font-semibold

Secondary button:
- border: 2px solid #2D6A4F
- color: #2D6A4F
- background: transparent
- rounded-xl, px-6 py-3, font-semibold

Amber CTA button:
- background: #f59e0b
- color: #0f1f2e
- rounded-xl, px-6 py-3, font-bold

## Card Styles
Standard card:
- bg-white rounded-2xl border border-gray-100 p-6
- hover: shadow-lg translateY(-2px)

Dark card:
- background: #0f1f2e rounded-2xl p-6
- text: white

## Input Styles
- border: 1px solid #dde8ee
- border-radius: rounded-xl
- padding: px-4 py-3
- focus: border-color #2D6A4F
- focus: box-shadow 0 0 0 3px rgba(45,106,79,0.15)

## Section Rules
Padding: py-16 lg:py-20
Max width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Alternating backgrounds: white and #f5f8fa

## Typography
Font: DM Sans (already imported)
Page headline: text-3xl sm:text-4xl font-bold 
  tracking-tight color #0f1f2e
Section subtitle: text-lg color #5a7080
Card title: text-lg font-semibold color #0f1f2e
Muted text: text-sm color #5a7080

## Accent Elements
Amber top bar: 4px full width gradient
  linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)
Green left border on cards: 4px solid #2D6A4F
Amber section labels: text-xs font-bold uppercase 
  tracking-widest color #f59e0b
