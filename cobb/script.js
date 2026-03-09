// Animate on scroll
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".anim").forEach((el) => obs.observe(el));

// Active nav highlight
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const sObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove("active"));
        const link = document.querySelector(
          '.nav-links a[href="#' + e.target.id + '"]',
        );
        if (link) link.classList.add("active");
      }
    });
  },
  { threshold: 0.4 },
);
sections.forEach((s) => sObs.observe(s));

// --- DIGITAL SENSOR LOGIC ---
class DigitalSensor {
  constructor() {
    this.selectedPriorities = [];
    this.softCommitments = [];
    this.expandedSections = [];
    this.meetingFocus = [];
    this.timeSpent = {};
    this.init();
  }

  init() {
    this.bindStateCards();
    this.bindPriorityButtons();
    this.bindSoftCommitments();
    this.bindExpandLinks();
    this.bindSlider();
    this.bindMeetingOptions();
    this.bindAccordions();
    this.bindInnerAccordions();
  }

  bindInnerAccordions() {
    const innerBtns = document.querySelectorAll(".inner-acc-btn");
    innerBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector(".tg-icon");
        const isClosed = content.style.maxHeight === "0px" || content.style.maxHeight === "";
        const parentAccContent = btn.closest(".acc-content");

        if (isClosed) {
          // Open
          if (parentAccContent) parentAccContent.style.maxHeight = "none";
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.opacity = "1";
          if (icon) icon.style.transform = "rotate(180deg)";
        } else {
          // Close
          content.style.maxHeight = "0px";
          content.style.opacity = "0";
          if (icon) icon.style.transform = "rotate(0deg)";
        }
      });
    });
  }

  bindAccordions() {
    const accBtns = document.querySelectorAll(".acc-btn");
    accBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector(".acc-icon");
        
        const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px" && content.style.maxHeight !== "0";

        if (isOpen) {
          content.style.maxHeight = "0px";
          if (icon) {
            icon.textContent = "+";
            icon.style.transform = "rotate(0deg)";
          }
        } else {
          // Close other accordions in the same list
          const parentList = btn.closest(".accordion-list");
          if (parentList) {
            parentList.querySelectorAll(".acc-content").forEach(c => c.style.maxHeight = "0px");
            parentList.querySelectorAll(".acc-icon").forEach(i => {
                i.textContent = "+";
                i.style.transform = "rotate(0deg)";
            });
          }
          // Open this one
          content.style.maxHeight = content.scrollHeight + "px";
          if (icon) {
            icon.textContent = "×";
            icon.style.transform = "rotate(90deg)";
          }
          
          // Log interaction
          const textEl = btn.querySelector(".st-text") || btn.querySelector("span");
          const title = textEl ? textEl.textContent.trim() : "Accordion";
          if (!this.expandedSections.includes(title)) {
            this.expandedSections.push(title);
            this.logPlaybook();
          }
        }
      });
    });
  }

  bindStateCards() {
    const cards = document.querySelectorAll(".state-card:not(.acc-btn)");
    const s1bSection = document.getElementById("s1-b");
    const contentMission = document.getElementById("content-mission");
    const contentSeeking = document.getElementById("content-seeking");
    const maturitySection = document.getElementById("maturity-section");

    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        const state = card.getAttribute("data-state");

        if (s1bSection) s1bSection.style.display = "block";

        if (state === "seeking") {
          if (contentMission) contentMission.style.display = "none";
          if (contentSeeking) contentSeeking.style.display = "";
        } else {
          if (contentSeeking) contentSeeking.style.display = "none";
          if (contentMission) contentMission.style.display = "";
          this.selectedPriorities = [];
          this.updatePriorityState();
        }
        
        // Trigger animations in the new section manually
        if (s1bSection) {
            const newAnims = s1bSection.querySelectorAll(".anim");
            newAnims.forEach(el => el.classList.add("visible"));
        }

        // Auto-scroll to the new section
        if (s1bSection) {
            setTimeout(() => {
                s1bSection.scrollIntoView({ behavior: 'smooth' });
            }, 400); // slight delay to allow UI to update
        }

        // Show maturity slider with a fade in reveal
        if (maturitySection) {
          maturitySection.style.opacity = "1";
          maturitySection.style.pointerEvents = "auto";
          maturitySection.style.height = "auto";
          maturitySection.style.padding = "20px 5%";
        }

        this.logPlaybook();
      });
    });
  }

  bindSlider() {
    const points = document.querySelectorAll(".slider-point");
    const fill = document.getElementById("slider-fill");
    const feedback = document.getElementById("mirror-feedback");

    if (!points.length) return;

    points.forEach((point, index) => {
      point.addEventListener("click", () => {
        // Reset all
        points.forEach((p) => p.classList.remove("active"));
        // Set active up to clicked
        for (let i = 0; i <= index; i++) {
          points[i].classList.add("active");
        }

        // Width calculation
        const percentage = (index / (points.length - 1)) * 100;
        fill.style.width = percentage + "%";

        // Feedback
        const msg = point.getAttribute("data-msg");
        feedback.textContent = msg;
        feedback.classList.remove("show");
        setTimeout(() => feedback.classList.add("show"), 50);

        this.logPlaybook();
      });
    });
  }

  bindMeetingOptions() {
    const options = document.querySelectorAll(".accel-btn");
    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const val = opt.getAttribute("data-topic");
        if (this.meetingFocus.includes(val)) {
          this.meetingFocus = this.meetingFocus.filter((f) => f !== val);
          opt.classList.remove("selected");
        } else {
          this.meetingFocus.push(val);
          opt.classList.add("selected");
        }
        this.logPlaybook();
      });
    });
  }

  bindPriorityButtons() {
    const btns = document.querySelectorAll(".priority-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-priority");
        if (this.selectedPriorities.includes(val)) {
          this.selectedPriorities = this.selectedPriorities.filter(
            (p) => p !== val,
          );
          btn.classList.remove("selected");
        } else {
          if (this.selectedPriorities.length < 2) {
            this.selectedPriorities.push(val);
            btn.classList.add("selected");
          }
        }
        this.updatePriorityState();
      });
    });
  }

  bindSoftCommitments() {
    const commits = document.querySelectorAll(".soft-commit-btn");
    commits.forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-commit");
        if (!this.softCommitments.includes(val)) {
          this.softCommitments.push(val);
          btn.classList.add("clicked");
          btn.textContent = "Noted";
          this.logPlaybook(); // Silently log on interaction
        }
      });
    });
  }

  bindExpandLinks() {
    const links = document.querySelectorAll(".expand-link");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        const title = link.previousElementSibling
          ? link.previousElementSibling.textContent
          : link.textContent;
        // Only log it the first time they open it
        if (
          link.nextElementSibling.classList.contains("open") &&
          !this.expandedSections.includes(title)
        ) {
          this.expandedSections.push(title.trim().substring(0, 40));
          this.logPlaybook();
        }
      });
    });
  }

  updatePriorityState() {
    const btns = document.querySelectorAll(".priority-btn");
    if (this.selectedPriorities.length >= 2) {
      btns.forEach((b) => {
        if (!b.classList.contains("selected")) b.classList.add("disabled");
      });
    } else {
      btns.forEach((b) => b.classList.remove("disabled"));
    }

    this.mutateHeroText();
    this.logPlaybook();
  }

  mutateHeroText() {
    const heroH1 = document.getElementById("hero-headline");
    const heroSub = document.getElementById("hero-subtext");

    if (!heroH1 || !heroSub) return;

    if (this.selectedPriorities.length === 0) {
      heroH1.innerHTML = `Oman's location is its <em>destiny</em>,<br>but its technology is its <em>choice</em>.`;
      heroSub.innerHTML = `<p>VISION 2040 has transformed the Sultanate into a beacon of strategic growth — positioning Oman as an indispensable gateway in the global logistics landscape. <strong style="color:rgba(255,255,255,.82)">ASYAD Group is the national steward of Oman's economic future.</strong> By consolidating the Sultanate's ports, free zones, and shipping assets into one multimodal platform, ASYAD has transformed Oman into a natural global hub, leveraging unparalleled access to four major continents.</p>`;
    }
    heroH1.style.animation = "none";
    heroH1.offsetHeight;
    heroH1.style.animation = "anim 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards";

    heroSub.style.animation = "none";
    heroSub.offsetHeight;
    heroSub.style.animation =
      "anim 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards";
  }

  logPlaybook() {
    console.log("--- 📊 ASYAD April Meeting Playbook ---");
    console.log("Priorities Selected:", this.selectedPriorities);
    console.log("Soft Commitments:", this.softCommitments);
    console.log("Deep Dives Explored (Clicked Expand):", this.expandedSections);

    // Get current maturity from UI
    const activePoints = document.querySelectorAll(".slider-point.active");
    if (activePoints.length > 0) {
      console.log(
        "Maturity Level Identified:",
        activePoints[activePoints.length - 1].querySelector(".slider-label")
          .textContent,
      );
    }

    console.log("Requested Meeting Focus:", this.meetingFocus);
    console.log("---------------------------------------");
  }
}

window.digitalSensor = new DigitalSensor();
