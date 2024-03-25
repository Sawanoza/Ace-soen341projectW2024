import React from 'react'
import {animateScroll as scroll} from 'react-scroll'
import { FaGithub } from 'react-icons/fa'
import { 
    FooterContainer, 
    FooterWrap, 
    FooterLinksContainer, 
    FooterLinksWrapper, 
    FooterLinkItems, 
    FooterLinkTitle, 
    FooterLink, 
    SocialMedia, 
    SocialMediaWrap, 
    SocialLogo, 
    WebsiteRights, 
    SocialIcons, 
    SocialIconLink } from './FooterElements'

const Footer = () => {
    const toggleHome = () => {
        scroll.scrollToTop();
    }

  return (
    <FooterContainer>
        <FooterWrap>
            <FooterLinksContainer>
                <FooterLinksWrapper>
                    <FooterLinkItems>
                        <FooterLinkTitle>About us</FooterLinkTitle>
                            <FooterLink to="/signin">How it works</FooterLink>
                            <FooterLink to="/signin">Testimonials</FooterLink>
                            <FooterLink to="/signin">Careers</FooterLink>
                            <FooterLink to="/signin">Investors</FooterLink>
                            <FooterLink to="/signin">Terms of Service</FooterLink>
                    </FooterLinkItems>
                    <FooterLinkItems>
                        <FooterLinkTitle>Contact Us</FooterLinkTitle>
                            <FooterLink to="/signin">Contact</FooterLink>
                            <FooterLink to="/signin">Support</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                    </FooterLinkItems>
                </FooterLinksWrapper>
                <FooterLinksWrapper>
                    <FooterLinkItems>
                        <FooterLinkTitle>Section 3</FooterLinkTitle>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                    </FooterLinkItems>
                    <FooterLinkItems>
                        <FooterLinkTitle>Section 4</FooterLinkTitle>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                            <FooterLink to="/signin">Title</FooterLink>
                    </FooterLinkItems>
                </FooterLinksWrapper>
            </FooterLinksContainer>
            <SocialMedia>
                <SocialMediaWrap>
                    <SocialLogo to='/' onClick={toggleHome}>Rent.</SocialLogo>
                    <WebsiteRights>Rent. © {new Date().getFullYear()} All rights reserved.</WebsiteRights>
                    <SocialIcons>
                        <SocialIconLink href="//github.com/Sawanoza/Ace-soen341projectW2024" target="_blank" aria-label="GitHub">
                            <FaGithub/>
                        </SocialIconLink>
                    </SocialIcons>
                </SocialMediaWrap>
            </SocialMedia>
        </FooterWrap>
    </FooterContainer>
  )
}

export default Footer