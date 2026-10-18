/*
 * The animation feature set, in its own module so MotionProvider can load it
 * after the first paint (`import()` makes it a separate chunk).
 */
import { domAnimation } from "framer-motion";

export default domAnimation;
