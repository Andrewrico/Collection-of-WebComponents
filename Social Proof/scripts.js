class SocialProof extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.cards = this.querySelectorAll(".social-proof-card");
    this.currentCardIndex = 0;
    this.waitTime = parseInt(this.getAttribute("wait"), 10) || 6000;
    this.showTime = parseInt(this.getAttribute("show"), 10) || 5000;
    this.addCSS();
    this.shadowRoot.innerHTML += `<slot></slot> `;
  }

  addCSS() {
    const cssLink = this.getAttribute("css-link");

    if (cssLink) {
      const linkElem = document.createElement("link");
      linkElem.rel = "stylesheet";
      linkElem.href = cssLink;
      this.shadowRoot.appendChild(linkElem);
    } else {
      this.addInternalCSS();
    }

    if (!cssLink && !this.internalCSSAdded) {
      fetch("./cards.css")
        .then((response) => response.text())
        .then((css) => {
          const styleElem = document.createElement("style");
          styleElem.textContent = css;
          this.shadowRoot.appendChild(styleElem);
        })
        .catch((error) => console.error(error));
    }
  }

  addInternalCSS() {
    const internalCSS = `
        :host {
            position: fixed;
            bottom: var(--social-proof-bottom);
            left: var(--social-proof-left);
            width: var(--social-proof-width);
            --social-proof-bottom: 130px;
            --social-proof-left: 10px;
            --social-proof-width: 300px;
            --social-proof-card-padding:4px  8px;
            --social-proof-card-border-radius: 6px;
            --social-proof-card-background:#fafafa;
            --social-proof-card-box-shadow:  0 3px 6px rgba(0, 0, 0, 0.3);
            --social-proof-card-transform: translate3d(0, 200%, 0);
            --social-proof-card-transition: opacity 0.5s, transform 1s;
            --social-proof-card-border: none;
            --social-proof-letter-background: #a1caca;
            --social-proof-letter-color: #3e9275 ; 
            --social-proof-avatar-background: #fff;
            --social-proof-avatar-border-radius: 50%;
            --social-proof-avatar-width: 80px;
            --social-proof-avatar-height: auto;
            --social-proof-avatar-min-height: 70px;
            --social-proof-avatar-padding: 0;
            --social-proof-image-border-radius: 50%;
            --social-proof-image-width: 80px;
            --social-proof-image-height: 80px;
            --social-proof-content-padding: 4px 12px;
            --social-proof-title-color: #262626;
            --social-proof-title-size: 16px;
            --social-proof-title-weight: 600;
            --social-proof-subtitle-color: #262626;
            --social-proof-subtitle-size: 14px;
            --social-proof-subtitle-weight: 300;
            --social-proof-counter-color: gray;
            --social-proof-counter-size: 12px;
            --social-proof-counter-weight: 600;
          }

          .social-proof-card .letter ,
          .social-proof-card .avatar ,
          .social-proof-card  {
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          .social-proof-card {
            position: absolute;
            justify-content: flex-start;
            overflow: hidden;
            width: 100%;
            opacity: 0;
            transform: var(--social-proof-card-transform);
            transition: var(--social-proof-card-transition);
            background: var(--social-proof-card-background);
            box-shadow: var(--social-proof-card-box-shadow);
            padding: var(--social-proof-card-padding);
            border-radius: var(--social-proof-card-border-radius);
            border: var(--social-proof-card-border);
          }

          .social-proof-card.visible {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          
          .social-proof-card .avatar {
            padding: 0;
            overflow: hidden;
            background: var(--social-proof-avatar-background);
            border-radius: var(--social-proof-avatar-border-radius);
            min-width: 80px;
            max-width: 100%;
            width: var(--social-proof-avatar-width);
            height: var(--social-proof-avatar-height);
            min-height: var(--social-proof-avatar-min-height);
            padding: var(--social-proof-avatar-padding);
          }
          
          .social-proof-card .image {
            display: block;
            object-fit: cover;
            border-radius: var(--social-proof-image-border-radius);
            width: var(--social-proof-image-width);
            height: var(--social-proof-image-height);
          }
  
          .social-proof-card .letter {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            font-size: 32px;
            background: var(--social-proof-letter-background);
            color: var(--social-proof-letter-color);
          }
  
          .social-proof-card .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            padding: var(--social-proof-content-padding);
          }
  
          .social-proof-card .title {
            padding-bottom: 4px;
            padding-right: 6px;
            color: var(--social-proof-title-color);
            font-size: var(--social-proof-title-size);
            font-weight: var(--social-proof-title-weight);
          }
  
          .social-proof-card .subtitle {
            color: var(--social-proof-subtitle-color);
            font-size: var(--social-proof-subtitle-size);
            font-weight: var(--social-proof-subtitle-weight);
          }
  
          .social-proof-card .counter {
            padding-top: 16px;
            color: var(--social-proof-counter-color);
            font-size: var(--social-proof-counter-size);
            font-weight: var(--social-proof-counter-weight);

          }
        </style>
      `;
    const styleElem = document.createElement("style");
    styleElem.textContent = internalCSS;
    this.shadowRoot.appendChild(styleElem);
  }

  connectedCallback() {
    this.cards.forEach((card) => {
      this.shadowRoot.appendChild(card);
    });
    this.init();
  }

  init() {
    this.showNextCard();
  }

  showNextCard() {
    setTimeout(() => {
      this.toggleCardVisibility();

      this.animationTimeout = setTimeout(() => {
        this.toggleCardVisibility();
        this.updateCurrentCardIndex();
        this.requestID = requestAnimationFrame(
          this.showNextCard.bind(this)
        );
      }, this.showTime);
    }, this.waitTime);

  }

  toggleCardVisibility() {
    this.cards[this.currentCardIndex].classList.toggle("visible");
  }

  updateCurrentCardIndex() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
  }

  disconnectedCallback() {
    clearTimeout(this.animationTimeout);
    cancelAnimationFrame(this.requestID);
  }
}

customElements.define("social-proof", SocialProof);