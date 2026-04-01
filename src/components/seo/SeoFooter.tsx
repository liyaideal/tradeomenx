import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

const footerLinks = {
  Product: [
    { label: "Events", path: "/events" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Insights", path: "/insights" },
  ],
  Resources: [
    { label: "FAQ", path: "/faq" },
    { label: "Glossary", path: "/glossary" },
    { label: "Methodology", path: "/methodology" },
    { label: "Developers", path: "/developers" },
  ],
  Company: [
    { label: "About", path: "/about" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
  ],
};

export const SeoFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/30 bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate("/")} className="mb-3">
              <Logo size="xl" />
            </button>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Trade on real-world event outcomes with transparent pricing and instant settlement.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-foreground mb-3">{heading}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OmenX. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Event trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
};
