# Phase 3: Form & Video Events - Research

**Researched:** 2026-01-25
**Domain:** Form submission and video engagement tracking with OpenPanel
**Confidence:** HIGH

## Summary

Research focused on implementing form submission tracking for the exit-intent modal email capture and video play event tracking for Hero and Bonus section videos. The codebase already has OpenPanel SDK integrated with established event naming patterns (nav_link_clicked, cta_clicked, pricing_cta_clicked) from Phase 2.

**Key findings:**
- OpenPanel uses `window.op('track', 'event_name', {properties})` API identical to existing click tracking
- HTML5 video element provides comprehensive event API (play, pause, timeupdate, ended) for engagement tracking
- Form submission tracking requires capturing both success and failure states from async fetch responses
- Video tracking should include video ID and play position to meet success criteria
- Primary risks: memory leaks from event listeners, duplicate tracking from multiple submissions, performance issues from high-frequency timeupdate events

**Primary recommendation:** Use HTML5 video events (play, pause, ended) with OpenPanel's track API. Track form submissions after async response with success/failure status. Use throttling for timeupdate events. Clean up event listeners in useEffect return.

## Standard Stack

Core tracking already in place from Phase 1-2:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| OpenPanel SDK | Current | Event tracking | Already integrated, privacy-friendly, supports custom events |
| HTML5 Video API | Native | Video events | Built into browser, no dependencies needed |
| React 18 | Existing | Component lifecycle | useEffect for event listener management |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Headless UI | Existing | Modal component | Already used for exit-intent modal |
| Lemon Squeezy API | External | Form submission | Already integrated for email capture |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| HTML5 native events | react-player library | Native events sufficient, no need for additional dependency |
| Manual throttle | lodash.throttle | Can implement lightweight throttle inline, avoid extra dependency |

**No additional installation needed** - all functionality available via existing dependencies and native browser APIs.

## Architecture Patterns

### Video Event Tracking Pattern

**Recommended approach:**
```javascript
React.useEffect(() => {
  const video = document.getElementById('video-id');

  const handlePlay = () => {
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'video_played', {
        video_id: 'hero-video',
        video_title: 'Course intro',
        location: 'hero'
      });
    }
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'video_paused', {
        video_id: 'hero-video',
        play_position: Math.round(video.currentTime),
        duration: Math.round(video.duration)
      });
    }
  };

  video.addEventListener('play', handlePlay);
  video.addEventListener('pause', handlePause);

  return () => {
    video.removeEventListener('play', handlePlay);
    video.removeEventListener('pause', handlePause);
  };
}, []);
```

**Why this pattern:**
- Matches existing OpenPanel tracking pattern from Phase 2
- useEffect cleanup prevents memory leaks
- Consistent event naming with existing schema
- video.currentTime and video.duration provide position data

### Form Submission Tracking Pattern

**Recommended approach:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let response = await fetch(formUrl, {
      method: "POST",
      body: new FormData(e.target),
    });

    if (response.ok) {
      // Track success AFTER confirmation
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'form_submitted', {
          form_name: 'email_capture',
          form_type: 'exit_intent_modal',
          status: 'success'
        });
      }
      // ... existing success logic
    } else {
      // Track failure with status code
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'form_submitted', {
          form_name: 'email_capture',
          form_type: 'exit_intent_modal',
          status: 'error',
          error_code: response.status
        });
      }
      alert("Sorry, we couldn't subscribe you.");
    }
  } catch (error) {
    // Track failure with error message
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'form_submitted', {
        form_name: 'email_capture',
        form_type: 'exit_intent_modal',
        status: 'error',
        error_type: 'network'
      });
    }
    alert("Sorry, there was an issue: " + error);
  } finally {
    setLoading(false);
  }
};
```

**Why this pattern:**
- Tracks AFTER response, not on submit button click (prevents duplicate tracking on validation errors)
- Captures success/failure status as required by success criteria
- Consistent with existing error handling
- Single event name with status parameter is cleaner than separate events

### Project Structure Impact

No new files needed - changes isolated to existing components:
```
app/components/
├── Modal.jsx          # Add form submission tracking
├── Hero.jsx           # Add video event tracking
└── Bonus.jsx          # Add video event tracking
```

### Anti-Patterns to Avoid

- **Don't track on form submit without waiting for response** - Creates duplicate events if validation fails or user clicks multiple times
- **Don't add timeupdate listeners without throttling** - Fires 4-250 times/second, creates performance issues
- **Don't forget useEffect cleanup** - Event listeners persist after unmount causing memory leaks
- **Don't track video play in onScroll** - Already auto-plays, track the actual play event instead

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Throttling timeupdate | Custom interval tracking | Throttle function or track milestones only (25%, 50%, 75%, 100%) | timeupdate fires 4-250 times/second, hand-rolled solutions miss edge cases |
| Event listener cleanup | Manual removeEventListener calls | useEffect return function | React's built-in cleanup ensures no memory leaks |
| Video progress calculation | Custom percentage math | (video.currentTime / video.duration) * 100 | Standard formula, handles edge cases like unknown duration |
| Duplicate submission prevention | Custom flags/state | Track after async response completes | Response-based tracking naturally prevents duplicates |

**Key insight:** HTML5 video API and React lifecycle methods already solve event management problems. OpenPanel's flexible event tracking accepts any custom properties, eliminating need for custom analytics wrapper.

## Common Pitfalls

### Pitfall 1: Memory Leaks from Video Event Listeners
**What goes wrong:** Event listeners added in useEffect persist after component unmount, causing memory leaks and duplicate event tracking
**Why it happens:** Video elements in DOM continue to fire events even after React component unmounts. Without cleanup, listeners accumulate on remounts.
**How to avoid:** Always return cleanup function from useEffect that removes all event listeners
**Warning signs:**
- Multiple identical events firing for single user action
- Increasing memory usage when navigating between pages
- React warning: "Can't perform a React state update on an unmounted component"

### Pitfall 2: Tracking Form Submit Too Early
**What goes wrong:** Tracking event fires on form submit button click, then fires again when user resubmits after validation error or network failure
**Why it happens:** Form validation and network requests happen AFTER submit event, creating gap between event and actual submission success
**How to avoid:** Track inside the `if (response.ok)` and error blocks AFTER async response completes
**Warning signs:**
- Higher form submission count than actual email captures
- Duplicate events with identical timestamps
- Conversion funnel shows form_submitted > success_count mismatch

### Pitfall 3: Unthrottled timeupdate Event Tracking
**What goes wrong:** timeupdate event fires 4-250 times per second during playback, causing performance degradation and analytics spam
**Why it happens:** HTML5 video fires timeupdate continuously during playback, not just at meaningful intervals
**How to avoid:** Either throttle to 1-2 second intervals OR only track meaningful milestones (play, 25%, 50%, 75%, 100%, pause, ended)
**Warning signs:**
- Page lag during video playback
- Thousands of video_progress events per user
- Analytics dashboard overwhelmed with video events

### Pitfall 4: Missing Video Element Null Checks
**What goes wrong:** `document.getElementById` returns null if called before video element renders, causing runtime errors
**Why it happens:** useEffect runs immediately after component mount, but video may not be in DOM yet due to conditional rendering or React hydration
**How to avoid:** Check if video element exists before adding listeners: `if (!video) return;`
**Warning signs:**
- Error: "Cannot read property 'addEventListener' of null"
- Tracking works in dev but fails in production (SSR timing differences)
- Events only tracked on page refresh, not initial load

### Pitfall 5: Tracking Video Play in Scroll Handler
**What goes wrong:** Current code auto-plays video in scroll handler. Adding tracking there creates false positives (tracks intent to autoplay, not actual user engagement)
**Why it happens:** Confusion between "browser attempted autoplay" and "user clicked play button"
**How to avoid:** Track actual 'play' event, which fires whether triggered by autoplay, user click, or programmatic play()
**Warning signs:**
- Video play events fire even when user hasn't interacted with video
- Play count doesn't match user engagement patterns
- Mobile shows high play counts despite autoplay being blocked

## Code Examples

Verified patterns from official sources:

### Video Event Tracking with Cleanup
```javascript
// Source: MDN HTMLMediaElement events + OpenPanel docs
React.useEffect(() => {
  const video = document.getElementById('hero-video');
  if (!video) return; // Null check critical

  const handlePlay = () => {
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'video_played', {
        video_id: 'hero-video',
        video_title: 'Course intro',
        location: 'hero'
      });
    }
  };

  const handleEnded = () => {
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'video_completed', {
        video_id: 'hero-video',
        duration: Math.round(video.duration)
      });
    }
  };

  video.addEventListener('play', handlePlay);
  video.addEventListener('ended', handleEnded);

  // CRITICAL: Cleanup to prevent memory leaks
  return () => {
    video.removeEventListener('play', handlePlay);
    video.removeEventListener('ended', handleEnded);
  };
}, []);
```

### Video Progress Tracking with currentTime
```javascript
// Source: MDN HTMLMediaElement.currentTime
const handlePause = () => {
  const video = document.getElementById('hero-video');
  const percentComplete = Math.round((video.currentTime / video.duration) * 100);

  if (typeof window !== 'undefined' && window.op) {
    window.op('track', 'video_paused', {
      video_id: 'hero-video',
      current_time: Math.round(video.currentTime), // seconds
      percent_complete: percentComplete
    });
  }
};
```

### Form Submission with Success/Failure Status
```javascript
// Source: OpenPanel track events docs + existing Modal.jsx pattern
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let response = await fetch(formUrl, {
      method: "POST",
      body: new FormData(e.target),
    });

    if (response.ok) {
      // Track AFTER success confirmed
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'form_submitted', {
          form_name: 'email_capture',
          form_type: 'exit_intent_modal',
          status: 'success',
          email_provided: true
        });
      }
      // ... download file logic
    } else {
      // Track failure with status
      if (typeof window !== 'undefined' && window.op) {
        window.op('track', 'form_submitted', {
          form_name: 'email_capture',
          form_type: 'exit_intent_modal',
          status: 'error',
          error_code: response.status
        });
      }
      alert("Sorry, we couldn't subscribe you.");
    }
  } catch (error) {
    // Track network errors
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'form_submitted', {
        form_name: 'email_capture',
        form_type: 'exit_intent_modal',
        status: 'error',
        error_type: 'network'
      });
    }
    alert("Sorry, there was an issue: " + error);
  } finally {
    setLoading(false);
  }
};
```

### Milestone-Based Video Tracking (Alternative to timeupdate)
```javascript
// Source: GA4 video tracking best practices + throttling patterns
React.useEffect(() => {
  const video = document.getElementById('hero-video');
  if (!video) return;

  const milestones = [25, 50, 75, 100];
  const trackedMilestones = new Set();

  const handleTimeUpdate = () => {
    const percentComplete = (video.currentTime / video.duration) * 100;

    milestones.forEach(milestone => {
      if (percentComplete >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);

        if (typeof window !== 'undefined' && window.op) {
          window.op('track', 'video_progress', {
            video_id: 'hero-video',
            milestone: milestone,
            current_time: Math.round(video.currentTime)
          });
        }
      }
    });
  };

  video.addEventListener('timeupdate', handleTimeUpdate);

  return () => {
    video.removeEventListener('timeupdate', handleTimeUpdate);
  };
}, []);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Track on form submit event | Track after async response | 2024-2025 | Eliminates duplicate tracking, captures actual success/failure |
| Custom video player libraries | HTML5 native events | 2024+ | Simpler implementation, no dependencies, better performance |
| Track every timeupdate | Milestone-based tracking (25%, 50%, 75%, 100%) | GA4 standard 2023+ | Reduces event volume by 99%, maintains meaningful insights |
| Separate success/error events | Single event with status property | Modern analytics 2024+ | Easier funnel analysis, cleaner dashboard |

**Deprecated/outdated:**
- Google Analytics Universal (GA3) milestone reporting - Deprecated, GA4 uses built-in video events
- jQuery video event binding - Modern React uses native addEventListener in useEffect
- Synchronous form tracking before validation - Async/await pattern captures actual submission result

## Open Questions

1. **Should we track video milestone progress (25%, 50%, 75%, 100%)?**
   - What we know: Success criteria require "play position" but don't specify granularity
   - What's unclear: Whether simple play/pause/ended events are sufficient or if detailed progress milestones are needed
   - Recommendation: Start with play/pause/ended events with currentTime position. Add milestones in Phase 4 if analytics show need for engagement funnel analysis

2. **Should we track modal open event separately from submission?**
   - What we know: Exit-intent modal opens on mouseleave, submission is separate user action
   - What's unclear: Whether modal open rate vs submission rate analysis is needed
   - Recommendation: Track only submission per OP-04 requirement. Can add modal_opened event in future if conversion funnel analysis needed

3. **How to handle video autoplay tracking?**
   - What we know: Both videos auto-play on scroll into view (Hero and Bonus)
   - What's unclear: Whether autoplay should be tracked differently from user-initiated play
   - Recommendation: Track all play events identically - OpenPanel analytics can filter by session context if needed

## Sources

### Primary (HIGH confidence)
- [OpenPanel Track Events API](https://openpanel.dev/docs/get-started/track-events) - Event tracking syntax and properties
- [MDN HTMLMediaElement play event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event) - When play event fires
- [MDN HTMLMediaElement events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) - Complete video event API
- [MDN HTMLMediaElement.currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime) - Video position tracking

### Secondary (MEDIUM confidence)
- [Google Analytics 4 Video Tracking Guide](https://analytify.io/ga4-video-tracking/) - Milestone tracking standards (25%, 50%, 75%, 100%)
- [Analytics Mania: Prevent Duplicate Form Submissions](https://www.analyticsmania.com/post/prevent-duplicate-form-submissions-with-google-tag-manager/) - Best practices for form tracking timing
- [FreeCodeCamp: Fix Memory Leaks in React](https://www.freecodecamp.org/news/fix-memory-leaks-in-react-apps/) - useEffect cleanup patterns
- [Analytics Debugger: Tracking HTML5 Video](https://analytics-debugger.com/blog/tracking-html5-video-audio-elements/) - Video event implementation patterns

### Tertiary (LOW confidence)
- [Video.js GitHub Issue #4322](https://github.com/videojs/video.js/issues/4322) - timeupdate event frequency documentation
- [DEV Community: Debouncing and Throttling](https://dev.to/waelhabbal/debouncing-and-throttling-in-javascript-optimizing-performance-for-user-actions-2m4p) - General throttling concepts

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - OpenPanel API verified from official docs, HTML5 events are web standards
- Architecture: HIGH - Patterns match existing Phase 2 implementation, verified with official MDN docs
- Pitfalls: HIGH - Memory leaks and duplicate tracking documented in multiple authoritative sources

**Research date:** 2026-01-25
**Valid until:** ~60 days (March 2026) - HTML5 standards stable, OpenPanel API stable per docs
