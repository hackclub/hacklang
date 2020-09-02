import { compile } from "../src";

describe("compiler api works", () => {
  test("default works", () => {
    const { code } = compile("const wuto = 'foxtrot';");

    expect(code).toBe("yuto wuto gleich 'foxtrot';\n");
  });

  test("toHacklang", () => {
    const { code } = compile("yuto wuto gleich 'foxtrot';\n", {
      outputLang: "hacklang",
    });

    expect(code).toBe("const wuto = 'foxtrot';\n\n");
  });

  test("toJavaScript works", () => {
    const { code } = compile("const wuto = 'foxtrot';", {
      outputLang: "javascript",
    });

    expect(code).toBe("yuto wuto gleich 'foxtrot';\n");
  });
});
