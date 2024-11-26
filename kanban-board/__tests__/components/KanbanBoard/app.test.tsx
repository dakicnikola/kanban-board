import {describe, expect, test} from 'vitest'
import {render} from "@testing-library/react";
import App from "../../../src/App";

describe('App', () => {
  test(' - will render', () => {
    expect(() => render(<App />)).not.toThrow();
  })
})
