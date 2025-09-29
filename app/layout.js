import "@/styles/styles.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";

export const metadata = {
  title: "ShopLite",
  description: "Mini e-commerce in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="container">{children}</main>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
