import "@testing-library/jest-dom";

// Mock the Image constructor to prevent actual image loading during tests
class MockImage {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;

  set src(_value: string) {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

Object.defineProperty(window, "Image", {
  writable: true,
  value: MockImage,
});