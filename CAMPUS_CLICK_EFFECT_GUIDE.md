# Campus Click Effect - Implementation Guide

## Overview

The **`.campus-click-effect`** class provides a consistent, interactive "press" feedback across the Student, Faculty, and Admin portals. When users click dashboard cards, navigation elements, or buttons, they'll see:

- **Scale animation**: Element shrinks to 98% (0.98 scale)
- **Teal outer glow**: Hex `#15847b` with 15px blur radius
- **Responsive timing**: 150ms transition for snappy feedback
- **Optional pulse**: Add `.pulse-teal` modifier for extended animation

---

## Basic Usage

### 1. Dashboard Cards (Student/Faculty/Admin)

```jsx
// Student Portal - Course Card
<div className="campus-click-effect">
  <div className="card">
    <h3>AI 101</h3>
    <p>Learn Neural Networks</p>
    <div className="card-footer">
      <span className="grade">A</span>
    </div>
  </div>
</div>
```

### 2. Navigation Elements

```jsx
// Faculty Portal - Quick Action Button
<button className="campus-click-effect action-btn">
  <span className="icon">✓</span>
  Approve Assignment
</button>
```

### 3. Management Tiles (Admin)

```jsx
// Admin Portal - KPI Card
<div className="campus-click-effect kpi-card" onClick={() => handleDetailView('students')}>
  <div className="kpi-header">
    <h4>Active Students</h4>
  </div>
  <div className="kpi-value">234</div>
  <div className="kpi-trend">+12% from last week</div>
</div>
```

---

## Enhanced Variant: Pulse Animation

For elements that need extra visual feedback, add the `.pulse-teal` modifier:

```jsx
// Admin Portal - Alert Card (with pulse feedback)
<div className="campus-click-effect pulse-teal alert-card">
  <h3>At-Risk Students Detected</h3>
  <p>5 students below minimum GPA</p>
  <button>Review Now</button>
</div>
```

**What happens:**
- On click, the element pulses with an expanding teal aura
- The aura fades over 0.4 seconds
- Creates a "ripple" effect while maintaining scale feedback

---

## CSS Details

### Base Class Behavior

```css
.campus-click-effect {
  transition: transform 150ms ease, box-shadow 150ms ease, outline 150ms ease;
  cursor: pointer;
  user-select: none;
}

.campus-click-effect:active {
  transform: scale(0.98);
  box-shadow: 0 0 15px 2px rgba(21, 132, 123, 0.7);
  outline: 1.5px solid #15847b;
}
```

**Key properties:**
- `transition`: 150ms for responsive feel (not too sluggish, not too fast)
- `cursor: pointer`: Visual cue that element is clickable
- `user-select: none`: Prevents text selection during rapid clicks
- `scale(0.98)`: Subtle shrink, 2% reduction
- `box-shadow`: 15px blur, 2px spread with 70% opacity teal
- `outline`: 1.5px solid border in teal (#15847b)

### Optional Pulse Animation

```css
@keyframes tealPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(21, 132, 123, 0.7),
                0 0 15px 2px rgba(21, 132, 123, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(21, 132, 123, 0),
                0 0 15px 2px rgba(21, 132, 123, 0.7);
    transform: scale(0.98);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(21, 132, 123, 0),
                0 0 15px 2px rgba(21, 132, 123, 0);
    transform: scale(1);
  }
}

.campus-click-effect.pulse-teal:active {
  animation: tealPulse 0.4s ease-out;
}
```

**Animation flow:**
1. **0%**: Full glow + base scale
2. **50%**: Outer ring expands and fades while element is at 0.98 scale
3. **100%**: All effects fade, element returns to full size

---

## Best Practices

### ✅ What to Apply `.campus-click-effect` To

- Dashboard cards (course enrollment, assignment, attendance)
- Action buttons (approve, submit, review)
- KPI tiles (metrics, analytics)
- Navigation menu items
- Modal action buttons
- Expandable list items

### ❌ What to Avoid

- Text-only links (use CSS `:hover` instead)
- Form inputs (let browser handle focus states)
- Disabled buttons (prevent click handler entirely)
- Rapidly-firing actions (use debounce/throttle)

### 🎨 Customization Tips

**For a stronger glow:**
```css
.campus-click-effect.strong-glow:active {
  box-shadow: 0 0 20px 3px rgba(21, 132, 123, 0.9);
  outline: 2px solid #15847b;
}
```

**For a subtler effect:**
```css
.campus-click-effect.subtle:active {
  transform: scale(0.99); /* 1% reduction instead of 2% */
  box-shadow: 0 0 10px 1px rgba(21, 132, 123, 0.5);
  outline: 1px solid #15847b;
}
```

**For disabled state (no feedback):**
```css
.campus-click-effect:disabled,
.campus-click-effect.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.campus-click-effect:disabled:active {
  transform: scale(1); /* No scale on disabled */
  box-shadow: none;
  outline: none;
}
```

---

## Files Modified

- `/frontend/student_app/src/styles.css` ✓
- `/frontend/faculty_app/src/styles.css` ✓
- `/frontend/admin_app/src/styles.css` ✓
- `/teal_theme.css` (root, for global consistency) ✓

---

## Testing Checklist

- [ ] Click a dashboard card → See scale + glow
- [ ] Click with `.pulse-teal` modifier → See expanding aura
- [ ] Tap on mobile/touch device → Immediate feedback
- [ ] Rapid-click elements → No lag or stutter
- [ ] Hover then click → Smooth transition
- [ ] Disabled element → No glow effect

---

## Example Component: Interactive Card

```jsx
import React, { useState } from 'react';
import './styles.css'; // Includes .campus-click-effect

const CourseCard = ({ course, onSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onSelect(course.id);
  };

  return (
    <div 
      className='campus-click-effect course-card'
      onClick={handleClick}
      role='button'
      tabIndex={0}
    >
      <div className='card-header'>
        <h3>{course.name}</h3>
        <span className='code'>{course.code}</span>
      </div>
      <div className='card-body'>
        <p>{course.description}</p>
        <div className='course-meta'>
          <span className='instructor'>{course.instructor}</span>
          <span className='schedule'>{course.schedule}</span>
        </div>
      </div>
      <div className='card-footer'>
        {isSelected && <span className='badge selected'>Selected</span>}
      </div>
    </div>
  );
};

export default CourseCard;
```

---

## Support & Feedback

If you need to:
- **Adjust timing** (faster/slower): Modify `150ms` in `.campus-click-effect`
- **Change color**: Replace `#15847b` and `rgba(21, 132, 123, 0.7)` with new hex/rgb
- **Add to more elements**: Copy-paste the class name; it's already in all stylesheets
- **Disable for specific elements**: Add `.no-click-effect { transform: scale(1) !important; box-shadow: none !important; }`

Happy clicking! 🎨✨
