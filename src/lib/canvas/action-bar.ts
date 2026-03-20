const CLIPPING_OVERFLOW_VALUES = new Set([
  "auto",
  "clip",
  "hidden",
  "overlay",
  "scroll",
]);

export interface BoundsRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

export function hasClippingOverflow(style: CSSStyleDeclaration): boolean {
  return (
    CLIPPING_OVERFLOW_VALUES.has(style.overflowX) ||
    CLIPPING_OVERFLOW_VALUES.has(style.overflowY)
  );
}

export function hasScrollableOverflow(style: CSSStyleDeclaration): boolean {
  return (
    style.overflowX === "auto" ||
    style.overflowX === "overlay" ||
    style.overflowX === "scroll" ||
    style.overflowY === "auto" ||
    style.overflowY === "overlay" ||
    style.overflowY === "scroll"
  );
}

export function intersectRects(
  left: BoundsRect,
  right: DOMRect | BoundsRect,
): BoundsRect | null {
  const nextLeft = Math.max(left.left, right.left);
  const nextTop = Math.max(left.top, right.top);
  const nextRight = Math.min(left.right, right.right);
  const nextBottom = Math.min(left.bottom, right.bottom);

  if (nextRight <= nextLeft || nextBottom <= nextTop) {
    return null;
  }

  return {
    left: nextLeft,
    top: nextTop,
    right: nextRight,
    bottom: nextBottom,
    width: nextRight - nextLeft,
    height: nextBottom - nextTop,
  };
}

export function getClippingAncestors(element: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = [];

  for (
    let currentElement = element.parentElement;
    currentElement;
    currentElement = currentElement.parentElement
  ) {
    const style =
      currentElement.ownerDocument.defaultView?.getComputedStyle(
        currentElement,
      );
    if (style && hasClippingOverflow(style)) {
      ancestors.push(currentElement);
    }
  }

  return ancestors;
}

export function getScrollableAncestors(element: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = [];

  for (
    let currentElement = element.parentElement;
    currentElement;
    currentElement = currentElement.parentElement
  ) {
    const style =
      currentElement.ownerDocument.defaultView?.getComputedStyle(
        currentElement,
      );
    if (style && hasScrollableOverflow(style)) {
      ancestors.push(currentElement);
    }
  }

  return ancestors;
}

export function getVisibleBounds(element: HTMLElement): BoundsRect | null {
  const ownerWindow = element.ownerDocument.defaultView;
  if (!ownerWindow) {
    return null;
  }

  let visibleBounds: BoundsRect = {
    left: 0,
    top: 0,
    right: ownerWindow.innerWidth,
    bottom: ownerWindow.innerHeight,
    width: ownerWindow.innerWidth,
    height: ownerWindow.innerHeight,
  };

  for (const clippingAncestor of getClippingAncestors(element)) {
    const nextVisibleBounds = intersectRects(
      visibleBounds,
      clippingAncestor.getBoundingClientRect(),
    );

    if (!nextVisibleBounds) {
      return null;
    }

    visibleBounds = nextVisibleBounds;
  }

  return visibleBounds;
}
