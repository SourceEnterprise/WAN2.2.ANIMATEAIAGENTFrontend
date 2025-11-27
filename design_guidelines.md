# Design Guidelines: Photo & Video Upload Form

## Design Approach
**System Selected:** Material Design (simplified)
**Rationale:** This is a utility-focused form requiring clarity, immediate feedback, and trust. Material Design provides excellent patterns for file uploads, progress indicators, and form validation.

## Typography
- **Primary Font:** Inter (Google Fonts)
- **Hierarchy:**
  - Form title: text-3xl, font-semibold
  - Section labels: text-sm, font-medium, uppercase tracking
  - Input labels: text-base, font-medium
  - Helper text: text-sm, regular
  - Error messages: text-sm, font-medium

## Layout System
**Spacing Scale:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Container: max-w-2xl, centered with mx-auto
- Vertical spacing between form sections: space-y-8
- Form padding: p-8 (desktop), p-6 (mobile)
- Input spacing: gap-6 between upload areas

## Core Components

### Container Structure
- Centered card layout on neutral background
- Card: rounded-xl, shadow-lg with subtle elevation
- Full viewport height centering: min-h-screen with flex centering
- Responsive width: w-full with max-w-2xl constraint

### File Upload Areas
**Photo Upload:**
- Large dropzone area: min-h-48, border-2 dashed, rounded-lg
- Center-aligned icon (image icon from Heroicons - use outline style)
- Upload instruction text: "Click to upload or drag and drop"
- File type hint below: "PNG, JPG, GIF up to 10MB"
- Preview thumbnail when file selected (max-h-32, rounded)

**Video Upload:**
- Similar dropzone: min-h-48, border-2 dashed, rounded-lg  
- Video icon from Heroicons (outline style)
- Upload instruction: "Click to upload or drag and drop"
- File type hint: "MP4, MOV, AVI up to 100MB"
- Video preview with basic controls when selected

### States & Feedback
**Upload States:**
- Default: Dashed border, subtle background
- Hover: Slightly darker background, solid border
- File selected: Solid border, show preview with filename and size
- Uploading: Progress bar (h-2, rounded-full, animated)
- Success: Green checkmark icon, success message
- Error: Red warning icon, error message

### Submit Button
- Full width at mobile, auto width at desktop (px-12)
- Prominent sizing: py-4, text-lg, font-semibold
- Positioned at form bottom with mt-8
- Disabled state when no files selected (reduced opacity)
- Loading spinner replaces text during submission

### Success/Error Messages
- Toast-style notification at top of form
- Success: Includes checkmark icon + "Files uploaded successfully!"
- Error: Warning icon + specific error message
- Auto-dismiss after 5 seconds with fade animation

## Interaction Patterns
- Click anywhere in dropzone to trigger file picker
- Drag-and-drop support with visual drag-over state
- File name display truncated with ellipsis if too long
- Remove file button (X icon) appears on file preview
- Form validation before submission (both files required)

## Accessibility
- Proper label associations for all inputs
- Focus indicators on all interactive elements (ring-2, ring-offset-2)
- Screen reader announcements for upload progress
- Keyboard navigation support for all actions
- ARIA labels for icon-only buttons

## Mobile Optimization
- Stack layout on mobile (single column)
- Touch-friendly tap targets (min 44px)
- Upload areas expand to full width
- Larger font sizes for readability
- Bottom-fixed submit button on mobile for easy access

## Images
No hero images or decorative imagery needed. This is a pure utility form focused on functionality.