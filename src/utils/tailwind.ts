import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
const twConfig = resolveConfig(tailwindConfig);
const mdBreakPoint = Number.parseInt((twConfig.theme?.screens as any).md);
export { mdBreakPoint };
