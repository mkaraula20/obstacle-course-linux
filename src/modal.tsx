import { createContext, useContext } from "react";

/**
 * A modal/overlay rendered with position:"fixed" must live at the app root, not
 * inside the page ScrollView — react-native-web's ScrollView is a transformed
 * ancestor, which makes "fixed" resolve against the scroller instead of the
 * viewport (the overlay ends up mispositioned, often below the fold). This host
 * lets any page push an overlay up to the root, where "fixed" === viewport.
 */
interface ModalHost {
  setOverlay: (node: React.ReactNode) => void;
}

export const ModalContext = createContext<ModalHost>({ setOverlay: () => {} });

export function useModalHost(): ModalHost {
  return useContext(ModalContext);
}
