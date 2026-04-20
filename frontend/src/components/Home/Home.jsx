import React from 'react';
import { 
  PageWrapper, NavbarContent, NavLogo, NavControls, NavButton,
  HeroContainer, HeroLeft, HeroRight, MainCTA,
  PhoneMockup, PhoneDynamicIsland, PhoneAppMock, PhoneWidget, PhoneImageMock,
  FeaturesSection, SectionTitle, FeaturesGrid, FeatureCard, FooterSection 
} from './Home.styled';
import keycloak from '../../keycloak';

const Home = () => {
  const handleRegister = () => keycloak.register();
  const handleLogin = () => keycloak.login();

  return (
    <PageWrapper>
      {/* NAVBAR */}
      <NavbarContent>
        <NavLogo>CloudStream</NavLogo>
        <NavControls>
          <NavButton onClick={handleLogin}>Se connecter</NavButton>
          <NavButton primary onClick={handleRegister}>Créer un compte</NavButton>
        </NavControls>
      </NavbarContent>

      {/* HERO SECTION */}
      <HeroContainer>
        <HeroLeft>
          <h1>Votre galaxie musicale.</h1>
          <p>
            Écoutez vos morceaux préférés, créez vos propres playlists et profitez 
            d'une expérience sonore inédite où que vous soyez. L'alliance parfaite 
            du design et de la performance.
          </p>
          <MainCTA onClick={handleLogin}>Écouter maintenant</MainCTA>
        </HeroLeft>

        <HeroRight>
          {/* CSS Phone Mockup resembling the provided image */}
          <PhoneMockup>
            <PhoneDynamicIsland />
            <PhoneAppMock>
              {/* Header inside phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff' }}></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Bonjour !</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Que voulez-vous écouter ?</div>
                </div>
              </div>
              
              {/* Image Map/Cover Mock inside player */}
              <PhoneImageMock>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </PhoneImageMock>

              {/* Player controls mock */}
              <PhoneWidget>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Lecture en cours</span>
                  <span style={{ fontSize: '12px', color: '#00e6ba' }}>HQ Audio</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', marginBottom: '15px' }}>
                  <div style={{ width: '60%', height: '100%', background: '#00e6ba', borderRadius: '2px' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                   <div style={{ height: '30px', flex: 1, background: '#222', borderRadius: '8px' }}></div>
                   <div style={{ height: '30px', flex: 1, background: '#222', borderRadius: '8px' }}></div>
                   <div style={{ height: '30px', flex: 1, background: '#222', borderRadius: '8px' }}></div>
                </div>
              </PhoneWidget>

            </PhoneAppMock>
          </PhoneMockup>
        </HeroRight>
      </HeroContainer>

      {/* FEATURES SECTION */}
      <FeaturesSection>
        <SectionTitle>Pourquoi choisir CloudStream ?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <div className="icon-wrapper">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h3>Audio Haute Qualité</h3>
            <p>Profitez de vos morceaux favoris sans perte de qualité. Une expérience pensée pour les oreilles les plus exigeantes.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-wrapper" style={{color: '#ff3b30', background: 'rgba(255, 59, 48, 0.1)'}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3>Sons Favoris & Playlists</h3>
            <p>Créez votre propre bibliothèque, ajoutez vos sons en favoris et concevez les playlists parfaites pour chaque moment.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-wrapper">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Sécurité Premium</h3>
            <p>Vos données et vos écoutes sont protégées par une infrastructure robuste et le protocole d'authentification Keycloak.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* FOOTER */}
      <FooterSection>
        <p>&copy; {new Date().getFullYear()} CloudStream. Tous droits réservés.</p>
      </FooterSection>
    </PageWrapper>
  );
};

export default Home;