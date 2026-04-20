import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotateX(5deg) rotateY(-15deg); }
  50% { transform: translateY(-20px) rotateX(5deg) rotateY(-15deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 59, 48, 0.4)); }
  50% { filter: drop-shadow(0 0 40px rgba(255, 59, 48, 0.7)); }
`;

export const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #050505;
  color: #fff;
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
`;

/* ==================================
             NAVBAR
================================== */
export const NavbarContent = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background: rgba(5, 5, 5, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  z-index: 1000;
`;

export const NavLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #00e6ba);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  letter-spacing: -0.5px;
`;

export const NavControls = styled.div`
  display: flex;
  gap: 16px;
`;

export const NavButton = styled.button`
  background: ${props => props.primary ? 'rgba(0, 230, 186, 0.15)' : 'transparent'};
  color: ${props => props.primary ? '#00e6ba' : '#fff'};
  border: 1px solid ${props => props.primary ? 'rgba(0, 230, 186, 0.5)' : 'rgba(255,255,255,0.2)'};
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? 'rgba(0, 230, 186, 0.25)' : 'rgba(255,255,255,0.1)'};
    transform: translateY(-2px);
  }
`;

/* ==================================
             HERO SECTION
================================== */
export const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 120px 5% 50px 5%;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(255, 59, 48, 0.15) 0%, transparent 70%);
    top: 20%; left: -10%;
    border-radius: 50%;
    z-index: 0; pointer-events: none;
  }
  
  &::after {
    content: "";
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0, 230, 186, 0.1) 0%, transparent 70%);
    bottom: 0%; right: -10%;
    border-radius: 50%;
    z-index: 0; pointer-events: none;
  }
`;

export const HeroLeft = styled.div`
  flex: 1;
  max-width: 600px;
  z-index: 10;
  
  h1 {
    font-size: 5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 20px;
    background: linear-gradient(to bottom right, #ffffff, #a0a0a0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
  }

  p {
    font-size: 1.25rem;
    color: #a0a0a0;
    margin-bottom: 40px;
    line-height: 1.6;
    max-width: 500px;
  }
`;

export const HeroRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  perspective: 1200px;
`;

export const MainCTA = styled.button`
  background: #ff3b30;
  color: #fff;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 59, 48, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 59, 48, 0.6);
    background: #ff4f45;
  }
`;

/* ==================================
          PHONE MOCKUP CSS
================================== */
export const PhoneMockup = styled.div`
  width: 340px;
  height: 680px;
  background: #0a0a0d;
  border-radius: 50px;
  border: 8px solid #222;
  box-shadow: 
    -20px 20px 60px rgba(0,0,0,0.8),
    inset 0 0 0 2px #333;
  position: relative;
  overflow: hidden;
  animation: ${float} 8s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  padding: 40px 20px 20px 20px;
`;

export const PhoneDynamicIsland = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 25px;
  background: #000;
  border-radius: 20px;
  z-index: 20;
`;

export const PhoneAppMock = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PhoneWidget = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

export const PhoneImageMock = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f1f1f, #0a0a0a);
  position: relative;
  overflow: hidden;
  animation: ${pulseGlow} 4s infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 60px;
    height: 60px;
    color: #ff3b30;
    opacity: 0.8;
  }
`;

/* ==================================
             FEATURES
================================== */
export const FeaturesSection = styled.section`
  padding: 100px 5%;
  background: #0a0a0a;
  position: relative;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  margin-bottom: 60px;
  font-weight: 800;
  color: #fff;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

export const FeatureCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s;

  &:hover {
    background: rgba(255,255,255,0.05);
    transform: translateY(-10px);
    border-color: rgba(0, 230, 186, 0.3);
  }

  .icon-wrapper {
    width: 80px; height: 80px;
    background: rgba(0, 230, 186, 0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px auto;
    color: #00e6ba;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 16px;
    color: #fff;
  }
  
  p {
    color: #a0a0a0;
    line-height: 1.6;
  }
`;

/* ==================================
             FOOTER
================================== */
export const FooterSection = styled.footer`
  padding: 60px 5% 40px 5%;
  background: #050505;
  border-top: 1px solid rgba(255,255,255,0.05);
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;