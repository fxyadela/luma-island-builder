/*
  Pointer-based window dragging for Luma Island.

  Use this when clickable controls should still allow dragging. A short press is
  treated as a click; movement past the threshold moves the Electron window and
  suppresses the accidental click at the end of the drag.
*/

export function installLumaWindowDrag(root, api = window.lumaWindow) {
  if (!root || !api?.getBounds || !api?.setPosition) return () => {};

  const editableSelector = 'input, textarea, select, option, [contenteditable="true"], .luma-no-drag';
  const threshold = 3;
  let dragState = null;
  let suppressNextClick = false;
  let frame = 0;
  let nextPosition = null;

  function schedulePosition(x, y) {
    nextPosition = { x, y };
    if (frame) return;

    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!nextPosition) return;
      api.setPosition(nextPosition.x, nextPosition.y);
      nextPosition = null;
    });
  }

  async function handlePointerDown(event) {
    if (event.button !== 0) return;
    if (event.target.closest(editableSelector)) return;

    const bounds = await api.getBounds();
    dragState = {
      pointerId: event.pointerId,
      startX: event.screenX,
      startY: event.screenY,
      startLeft: bounds.x,
      startTop: bounds.y,
      moved: false
    };

    root.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    const dx = event.screenX - dragState.startX;
    const dy = event.screenY - dragState.startY;

    if (!dragState.moved && Math.hypot(dx, dy) < threshold) return;

    dragState.moved = true;
    root.classList.add("is-dragging");
    schedulePosition(Math.round(dragState.startLeft + dx), Math.round(dragState.startTop + dy));
    event.preventDefault();
  }

  function finishDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    if (dragState.moved) {
      suppressNextClick = true;
      event.preventDefault();
      event.stopPropagation();
    }

    root.releasePointerCapture?.(event.pointerId);
    root.classList.remove("is-dragging");
    dragState = null;
  }

  function handleClick(event) {
    if (!suppressNextClick) return;
    suppressNextClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  root.addEventListener("pointerdown", handlePointerDown);
  root.addEventListener("pointermove", handlePointerMove);
  root.addEventListener("pointerup", finishDrag);
  root.addEventListener("pointercancel", finishDrag);
  root.addEventListener("click", handleClick, true);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    root.removeEventListener("pointerdown", handlePointerDown);
    root.removeEventListener("pointermove", handlePointerMove);
    root.removeEventListener("pointerup", finishDrag);
    root.removeEventListener("pointercancel", finishDrag);
    root.removeEventListener("click", handleClick, true);
  };
}
