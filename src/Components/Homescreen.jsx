import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import Logo from './Images/shanmuga-innovations-llp-pink.png';

const GlobalFont = createGlobalStyle`
  body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
`;

// --- Animations ---
const floaty = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
`;

const floaty2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-4deg); }
  50% { transform: translateY(-22px) rotate(4deg); }
`;

const dash = keyframes`
  to { stroke-dashoffset: -400; }
`;

// --- Reveal-on-scroll wrapper ---
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.unobserve(el);
      }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
};

const RevealDiv = styled.div`
  opacity: ${props => (props.$inview ? 1 : 0)};
  transform: translateY(${props => (props.$inview ? '0' : '30px')});
  transition: opacity 0.7s ease, transform 0.7s ease;
`;

const Reveal = ({ children, ...rest }) => {
  const [ref, inView] = useInView();
  return (
    <RevealDiv ref={ref} $inview={inView} {...rest}>
      {children}
    </RevealDiv>
  );
};

// --- Page ---
const Page = styled.div`
  background: #FFFFFF;
  overflow-x: hidden;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 5vw;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(201, 79, 135, 0.10);
  box-sizing: border-box;

  @media (max-width: 720px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  img {
    height: 44px;
    width: auto;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 14px;
  font-weight: 500;

  a {
    color: #2B2230;
    text-decoration: none;
  }
  a:hover {
    color: #A83A6E;
  }

  @media (max-width: 720px) {
    gap: 14px;
    font-size: 13px;
  }
`;

const NavLoginPill = styled.button`
  background: linear-gradient(135deg, #D9538F, #A83A6E);
  color: #FFFFFF;
  padding: 10px 26px;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  box-shadow: 0 8px 20px -8px rgba(201, 79, 135, 0.6);
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const Hero = styled.header`
  position: relative;
  min-height: 70vh; /* Reduced from 88vh to decrease empty space */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 5vw 60px; /* Adjusted padding-top to account for fixed header but keep gap small */
  background: linear-gradient(180deg, #FFFFFF 0%, #FDF2F7 45%, #F0FAF7 100%);
`;

const FloatingLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const DashedPath = styled.path`
  animation: ${dash} 9s linear infinite;
`;

const FloatIcon = styled.div`
  position: absolute;
  animation: ${props => (props.$alt ? floaty2 : floaty)} ${props => props.$duration || '8s'} ease-in-out infinite;
  opacity: ${props => props.$opacity || 0.6};
  ${props => props.$left && `left: ${props.$left};`}
  ${props => props.$right && `right: ${props.$right};`}
  ${props => props.$top && `top: ${props.$top};`}
`;

const HeroInner = styled.div`
  max-width: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(201, 79, 135, 0.08);
  border: 1px solid rgba(201, 79, 135, 0.2);
  color: #A83A6E;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 999px;
  letter-spacing: 0.04em;
`;

const CompanyMark = styled.div`
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #C94F87;
  margin-top: -4px;

  span {
    color: #2B2230;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(38px, 5.6vw, 68px);
  font-weight: 800;
  line-height: 1.08;
  margin: 0;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(90deg, #D9538F, #A83A6E 50%, #2BB3A3);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const HeroText = styled.p`
  font-size: clamp(15px, 1.6vw, 19px);
  line-height: 1.7;
  color: #6B5A66;
  max-width: 680px;
  margin: 0;
  font-weight: 400;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`;

const ButtonBase = styled.a`
  padding: 15px 34px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.15s ease;
  cursor: pointer;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, #D9538F, #A83A6E);
  color: #FFFFFF;
  box-shadow: 0 14px 30px -10px rgba(201, 79, 135, 0.55);

  &:hover {
    color: #FFFFFF;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: #FFFFFF;
  color: #A83A6E;
  border: 2px solid rgba(201, 79, 135, 0.35);
  padding: 13px 32px;

  &:hover {
    color: #A83A6E;
  }
`;

const TertiaryButton = styled(ButtonBase)`
  background: rgba(43, 179, 163, 0.1);
  color: #1E8A7D;
  border: 2px solid rgba(43, 179, 163, 0.35);
  padding: 13px 32px;

  &:hover {
    color: #1E8A7D;
  }
`;

const StatsStrip = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 56px;
  padding: 26px 5vw;
  border-top: 1px solid #F6E4ED;
  border-bottom: 1px solid #F6E4ED;
  background: #FFFFFF;
  font-size: 13.5px;
  color: #6B5A66;

  strong {
    color: #2B2230;
  }
`;

const Section = styled.section`
  padding: 90px 5vw;
  max-width: 1200px;
  margin: 0 auto;
`;

const AboutSection = styled(Section)`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  align-items: center;
  justify-content: center;
`;

const AboutText = styled.div`
  flex: 1 1 420px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Eyebrow = styled.div`
  color: #D9538F;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.14em;
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: 800;
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;
`;

const BodyText = styled.p`
  color: #6B5A66;
  line-height: 1.8;
  margin: 0;
  font-size: 15.5px;
`;

const SpecialtyWrap = styled.div`
  flex: 1 1 380px;
  min-width: 300px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: flex-start;
`;

const SpecialtyPill = styled.div`
  background: linear-gradient(135deg, rgba(217, 83, 143, 0.07), rgba(43, 179, 163, 0.07));
  border: 1px solid rgba(201, 79, 135, 0.16);
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 500;
  color: #4A3A46;
`;

const ServicesSection = styled.section`
  padding: 90px 5vw;
  background: linear-gradient(180deg, #FDF2F7, #FFFFFF);
`;

const ServicesInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 44px;
`;

const CenteredHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: ${props => props.$mb || '0'};
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
`;

const ServiceCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(201, 79, 135, 0.12);
  border-radius: 22px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 12px 32px -18px rgba(90, 40, 70, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 44px -18px rgba(90, 40, 70, 0.35);
  }
`;

const ServiceGlyph = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.$tint};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$ink};
  font-weight: 800;
  font-size: 15px;
`;

const ServiceTitle = styled.div`
  font-weight: 700;
  font-size: 17px;
`;

const ServiceDesc = styled.div`
  color: #6B5A66;
  font-size: 14px;
  line-height: 1.65;
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 18px;
`;

const PillarCard = styled.div`
  border: 1px solid rgba(43, 179, 163, 0.2);
  background: linear-gradient(180deg, rgba(43, 179, 163, 0.05), rgba(217, 83, 143, 0.04));
  border-radius: 18px;
  padding: 26px 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PillarStat = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: #A83A6E;
`;

const PillarLabel = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: #4A3A46;
`;

const TechSection = styled.section`
  padding: 80px 5vw;
  background: #241B22;
  color: #FFFFFF;
`;

const TechInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 34px;
  align-items: center;
  text-align: center;
`;

const TechEyebrow = styled(Eyebrow)`
  color: #F2A9C8;
`;

const TechTitle = styled.h2`
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const Chip = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(217, 83, 143, 0.25);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
`;

const FeatureCard = styled.div`
  background: #FFFFFF;
  border: 1px solid rgba(201, 79, 135, 0.14);
  border-radius: 18px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 10px 26px -18px rgba(90, 40, 70, 0.3);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D9538F, #2BB3A3);
  flex: none;
`;

const FeatureLabel = styled.div`
  font-weight: 600;
  font-size: 14.5px;
  color: #3A2C36;
`;

const CtaSection = styled.section`
  margin: 0 5vw 90px;
  border-radius: 28px;
  background: linear-gradient(120deg, #D9538F, #A83A6E 55%, #1E8A7D);
  padding: 64px 6vw;
  text-align: center;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
`;

const CtaTitle = styled.h2`
  font-size: clamp(26px, 3.2vw, 40px);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
`;

const CtaText = styled.p`
  margin: 0;
  opacity: 0.9;
  max-width: 560px;
  font-size: 15.5px;
  line-height: 1.7;
`;

const CtaActions = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CtaWhiteButton = styled.a`
  background: #FFFFFF;
  color: #A83A6E;
  padding: 14px 32px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
`;

const CtaOutlineButton = styled.button`
  border: 2px solid rgba(255, 255, 255, 0.7);
  color: #FFFFFF;
  background: transparent;
  padding: 12px 30px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  font-family: inherit;
`;

const Footer = styled.footer`
  background: #241B22;
  color: #C9BAC4;
  padding: 64px 5vw 32px;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 44px;
  justify-content: space-between;
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 340px;
`;

const FooterLogoBadge = styled.div`
  background: #FFFFFF;
  border-radius: 14px;
  padding: 10px 16px;
  align-self: flex-start;

  img {
    height: 40px;
    width: auto;
    display: block;
  }
`;

const FooterName = styled.div`
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #FFFFFF;
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13.5px;
  line-height: 1.7;
`;

const FooterColTitle = styled.div`
  color: #FFFFFF;
  font-weight: 700;
  font-size: 14px;
`;

const FooterLink = styled.a`
  color: #F2A9C8;
  text-decoration: none;
  &:hover {
    color: #FFFFFF;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 44px auto 0;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 12.5px;
  color: #8E7B88;
`;

// --- Content ---
const SPECIALTIES = ['Healthcare Software', 'Hospital Information Systems', 'Electronic Medical Records', 'Laboratory Information Systems', 'Pharmacy Management', 'AI Automation', 'Digital Transformation', 'Cloud Applications', 'Custom Enterprise Software'];

const pink = { tint: 'rgba(217,83,143,0.12)', ink: '#A83A6E' };
const teal = { tint: 'rgba(43,179,163,0.14)', ink: '#1E8A7D' };

const SERVICES = [
  { glyph: 'HMS', title: 'Hospital Management System', desc: 'End-to-end OP, IP, billing, and administration for single and multi-hospital networks.', ...pink },
  { glyph: 'RX', title: 'Online Pharmacy & Medicine Delivery', desc: 'E-commerce pharmacy with inventory, prescriptions, and doorstep delivery.', ...teal },
  { glyph: 'EMS', title: 'Ambulance Management', desc: 'Dispatch, live tracking, and fleet coordination for emergency services.', ...pink },
  { glyph: 'DR', title: 'Doctor Consultation', desc: 'Telemedicine with scheduling, video consults, and e-prescriptions.', ...teal },
  { glyph: 'HC', title: 'Home Care Management', desc: 'Care plans, visit scheduling, and monitoring for home-based patients.', ...pink },
  { glyph: 'LIS', title: 'Laboratory Information System', desc: 'Sample tracking, results, and integrated diagnostic reporting.', ...teal },
  { glyph: 'AI', title: 'AI Healthcare Automation', desc: 'Intelligent triage, documentation, and workflow automation.', ...pink },
  { glyph: 'CLD', title: 'Cloud Solutions', desc: 'Secure, scalable cloud deployment and managed infrastructure.', ...teal },
  { glyph: 'BI', title: 'Healthcare Analytics', desc: 'Real-time dashboards and reports for clinical and business insight.', ...pink },
];

const PILLARS = [
  { stat: '100%', label: 'Innovative Solutions' },
  { stat: 'ISO-grade', label: 'Secure Architecture' },
  { stat: 'AI', label: 'Powered Intelligence' },
  { stat: 'Cloud', label: 'Ready Deployment' },
  { stat: '24/7', label: 'Support' },
  { stat: '∞', label: 'Scalable Systems' },
];

const STACK = ['React', 'Django', 'Python', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'AI / ML', 'REST API'];

const FEATURES = ['Secure Authentication', 'Face Recognition', 'Role Based Access', 'Real Time Dashboard', 'Reports & Analytics', 'Multi Hospital Support', 'Mobile Friendly', 'Cloud Deployment'];

const Landing = () => {
  const navigate = useNavigate();
  const goLogin = () => navigate(`${import.meta.env.BASE_URL}login`);

  return (
    <Page>
      <GlobalFont />
      <Nav>
        <img src={Logo} alt="Shanmuga Innovations LLP" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <NavLinks>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#technology">Technology</a>
          <a href="#contact">Contact</a>
          <NavLoginPill onClick={goLogin}>Login</NavLoginPill>
        </NavLinks>
      </Nav>

      <Hero>
        <FloatingLayer aria-hidden="true">
          <FloatIcon $right="8%" $top="18%" $duration="7s" $opacity={0.7}>
            <svg width="44" height="44" viewBox="0 0 44 44"><rect x="17" y="6" width="10" height="32" rx="4" fill="#F2A9C8" /><rect x="6" y="17" width="32" height="10" rx="4" fill="#F2A9C8" /></svg>
          </FloatIcon>
          <FloatIcon $left="16%" $top="62%" $alt $duration="9s" $opacity={0.7}>
            <svg width="46" height="46" viewBox="0 0 46 46"><rect x="6" y="16" width="34" height="15" rx="7.5" fill="#7ED4C3" transform="rotate(-30 23 23)" /><rect x="23" y="16" width="17" height="15" rx="7.5" fill="#2BB3A3" transform="rotate(-30 23 23)" /></svg>
          </FloatIcon>
          <FloatIcon $right="10%" $top="20%" $alt $duration="8s" $opacity={0.75}>
            <svg width="52" height="52" viewBox="0 0 52 52"><path d="M26 44 C14 34 6 27 6 18 A10 10 0 0 1 26 14 A10 10 0 0 1 46 18 C46 27 38 34 26 44 Z" fill="#F2A9C8" /><path d="M12 27 h8 l3-6 4 10 3-6 h10" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </FloatIcon>
          <FloatIcon $right="18%" $top="64%" $duration="10s" $opacity={0.7}>
            <svg width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="23" r="6" fill="#2BB3A3" /><circle cx="8" cy="10" r="4" fill="#7ED4C3" /><circle cx="38" cy="10" r="4" fill="#7ED4C3" /><circle cx="8" cy="36" r="4" fill="#7ED4C3" /><circle cx="38" cy="36" r="4" fill="#7ED4C3" /><path d="M12 13 L19 19 M34 13 L27 19 M12 33 L19 27 M34 33 L27 27" stroke="#7ED4C3" strokeWidth="2" /></svg>
          </FloatIcon>
          <FloatIcon $left="44%" $top="8%" $duration="11s" $opacity={0.55}>
            <svg width="54" height="38" viewBox="0 0 54 38"><path d="M14 30 a10 10 0 1 1 3-19 a12 12 0 0 1 23 3 a8 8 0 0 1 0 16 Z" fill="#CDEFE8" /></svg>
          </FloatIcon>
        </FloatingLayer>

        <HeroInner>
          <Badge>HEALTHCARE TECHNOLOGY &middot; EST. 2025</Badge>
          <CompanyMark>SHANMUGA <span>INNOVATIONS LLP</span></CompanyMark>
          <HeroTitle>Innovating Healthcare<br /><span>Through Technology</span></HeroTitle>
          <HeroText>Building intelligent digital healthcare solutions that connect hospitals, doctors, pharmacies, ambulance services, laboratories, home care providers, and patients on one secure platform.</HeroText>
          <HeroActions>
            <PrimaryButton href="#services">Explore Solutions</PrimaryButton>
            <SecondaryButton href="#contact">Contact Us</SecondaryButton>
            <TertiaryButton onClick={goLogin}>Login</TertiaryButton>
          </HeroActions>
          <svg width="360" height="40" viewBox="0 0 360 40" style={{ marginTop: '10px', opacity: 0.8 }} aria-hidden="true">
            <DashedPath d="M0 20 h90 l12-14 14 26 12-20 8 8 h90 l10-10 12 18 10-8 h102" fill="none" stroke="#D9538F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 6" />
          </svg>
        </HeroInner>
      </Hero>

      <StatsStrip>
        <div><strong>Incorporated:</strong> 17 March 2025</div>
        <div><strong>Status:</strong> <span style={{ color: '#1E8A7D', fontWeight: 600 }}>Active</span></div>
        <div><strong>ROC:</strong> RoC-Coimbatore</div>
        <div><strong>Industry:</strong> Computer Programming, Consultancy &amp; Related Activities</div>
      </StatsStrip>

      <AboutSection id="about">
        <Reveal as={AboutText}>
          <Eyebrow>ABOUT US</Eyebrow>
          <SectionTitle>Software built for the future of care</SectionTitle>
          <BodyText>SHANMUGA INNOVATIONS LLP is a healthcare technology and software innovation company. We design, build, and operate enterprise-grade digital health platforms — from hospital information systems to AI-driven automation — helping care providers deliver faster, safer, and more connected patient experiences.</BodyText>
        </Reveal>
        <Reveal as={SpecialtyWrap}>
          {SPECIALTIES.map((s) => (
            <SpecialtyPill key={s}>{s}</SpecialtyPill>
          ))}
        </Reveal>
      </AboutSection>

      <ServicesSection id="services">
        <ServicesInner>
          <CenteredHeader>
            <Eyebrow>OUR SERVICES</Eyebrow>
            <SectionTitle>One platform, every care setting</SectionTitle>
          </CenteredHeader>
          <ServicesGrid>
            {SERVICES.map((sv) => (
              <Reveal as={ServiceCard} key={sv.title}>
                <ServiceGlyph $tint={sv.tint} $ink={sv.ink}>{sv.glyph}</ServiceGlyph>
                <ServiceTitle>{sv.title}</ServiceTitle>
                <ServiceDesc>{sv.desc}</ServiceDesc>
              </Reveal>
            ))}
          </ServicesGrid>
        </ServicesInner>
      </ServicesSection>

      <Section>
        <CenteredHeader $mb="44px">
          <Eyebrow>WHY CHOOSE US</Eyebrow>
          <SectionTitle>Enterprise-grade by design</SectionTitle>
        </CenteredHeader>
        <PillarsGrid>
          {PILLARS.map((p) => (
            <Reveal as={PillarCard} key={p.label}>
              <PillarStat>{p.stat}</PillarStat>
              <PillarLabel>{p.label}</PillarLabel>
            </Reveal>
          ))}
        </PillarsGrid>
      </Section>

      <TechSection id="technology">
        <TechInner>
          <TechEyebrow>TECHNOLOGY STACK</TechEyebrow>
          <TechTitle>Modern, proven, cloud-native</TechTitle>
          <ChipRow>
            {STACK.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </ChipRow>
        </TechInner>
      </TechSection>

      <Section>
        <CenteredHeader $mb="44px">
          <Eyebrow>PLATFORM FEATURES</Eyebrow>
          <SectionTitle>Everything a health system needs</SectionTitle>
        </CenteredHeader>
        <FeaturesGrid>
          {FEATURES.map((f) => (
            <FeatureCard key={f}>
              <FeatureDot />
              <FeatureLabel>{f}</FeatureLabel>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      <CtaSection>
        <CtaTitle>Ready to digitize your care delivery?</CtaTitle>
        <CtaText>Talk to our team about hospital management, telemedicine, pharmacy, and AI automation for your organization.</CtaText>
        <CtaActions>
          <CtaWhiteButton href="mailto:support@shinova.in">Contact Us</CtaWhiteButton>
          <CtaOutlineButton onClick={goLogin}>Login</CtaOutlineButton>
        </CtaActions>
      </CtaSection>

      <Footer id="contact">
        <FooterInner>
          <FooterBrand>
            <FooterLogoBadge><img src={Logo} alt="Shanmuga Innovations LLP" /></FooterLogoBadge>
            <FooterName>SHANMUGA INNOVATIONS LLP</FooterName>
            <div style={{ fontSize: '13.5px', lineHeight: 1.7 }}>Healthcare technology and software innovation company building connected digital health platforms.</div>
          </FooterBrand>
          <FooterCol>
            <FooterColTitle>Registered Address</FooterColTitle>
            <div>23, C. Saradha College Main Road,<br />Hasthampatti, Salem,<br />Tamil Nadu &ndash; 636007</div>
          </FooterCol>
          <FooterCol>
            <FooterColTitle>Contact</FooterColTitle>
            <FooterLink href="mailto:support@shinova.in">support@shinova.in</FooterLink>
            <FooterLink as="button" onClick={goLogin} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}>Portal Login</FooterLink>
          </FooterCol>
        </FooterInner>
        <FooterBottom>&copy; 2025 SHANMUGA INNOVATIONS LLP. All Rights Reserved.</FooterBottom>
      </Footer>
    </Page>
  );
};

export default Landing;
