document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "5583998326680";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const yearElement = document.querySelector("[data-year]");
  const form = document.querySelector("[data-contact-form]");
  const feedback = document.querySelector("[data-form-feedback]");

  function setCurrentYear() {
    if (yearElement) yearElement.textContent = new Date().getFullYear();
  }

  function handleHeaderScroll() {
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function handleMenu() {
    if (!menuToggle || !menu) return;

    const openMenu = () => {
      menuToggle.classList.add("is-active");
      menu.classList.add("is-open");
      body.classList.add("menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Fechar menu");
    };

    const closeMenu = () => {
      menuToggle.classList.remove("is-active");
      menu.classList.remove("is-open");
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    };

    menuToggle.addEventListener("click", () => {
      menu.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    menu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    }, { passive: true });
  }

  function handleFaq() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const button = item.querySelector("button");
      if (!button) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        faqItems.forEach((currentItem) => {
          const currentButton = currentItem.querySelector("button");
          currentItem.classList.remove("is-open");
          if (currentButton) currentButton.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function handleReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach((element) => observer.observe(element));
  }

  function onlyNumbers(value) {
    return value.replace(/\D/g, "");
  }

  function maskPhone(value) {
    const numbers = onlyNumbers(value).slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  function handlePhoneMask() {
    const phoneInput = document.querySelector("#whatsapp");
    if (!phoneInput) return;

    phoneInput.addEventListener("input", () => {
      phoneInput.value = maskPhone(phoneInput.value);
    });
  }

  function buildWhatsAppMessage(data) {
    const lines = [
      "Ola, gostaria de solicitar um diagnostico financeiro para minha empresa.",
      "",
      `Nome: ${data.nome}`,
      `Empresa: ${data.empresa}`,
      `WhatsApp: ${data.whatsapp}`,
      `E-mail: ${data.email}`,
      "",
      "Mensagem:",
      data.mensagem
    ];

    return encodeURIComponent(lines.join("\n"));
  }

  function handleForm() {
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = form.querySelector(".form-submit");

      const data = {
        nome: String(form.nome.value || "").trim(),
        empresa: String(form.empresa.value || "").trim(),
        whatsapp: String(form.whatsapp.value || "").trim(),
        email: String(form.email.value || "").trim(),
        mensagem: String(form.mensagem.value || "").trim()
      };

      const hasEmptyField = Object.values(data).some((value) => value.length === 0);

      if (hasEmptyField) {
        if (feedback) feedback.textContent = "Preencha todos os campos para continuar.";
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Preparando mensagem...";
      }

      const message = buildWhatsAppMessage(data);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      if (feedback) feedback.textContent = "Abrindo WhatsApp com sua solicitacao.";

      window.open(url, "_blank", "noopener,noreferrer");

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Solicitar diagnostico financeiro";
        }
      }, 900);
    });
  }

  setCurrentYear();
  handleHeaderScroll();
  handleMenu();
  handleFaq();
  handleReveal();
  handlePhoneMask();
  handleForm();
});
