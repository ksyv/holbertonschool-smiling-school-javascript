$(document).ready(function () {
    // Fonction pour récupérer les citations
    function fetchQuotes() {
      $.ajax({
        url: "https://smileschool-api.hbtn.info/quotes",
        dataType: "json",
        beforeSend: function () {
          $(".loader").show();
        },
        success: function (data) {
          updateCarouselQuotes(data);
        },
        error: function () {
          console.error("Erreur de chargement.");
        },
        complete: function () {
          $(".loader").hide();
        }
      });
    }

    // Fonction pour mettre à jour le carrousel des citations
    function updateCarouselQuotes(quotes) {
      const carouselInner = $('#carouselExampleControls .carousel-inner');
      carouselInner.empty();

      quotes.forEach((quote, index) => {
        let carouselItem = $('<div class="carousel-item"></div>');
        if (index === 0) {
          carouselItem.addClass('active');
        }

        let quoteContent = `
                      <div class="row mx-auto align-items-center">
                      <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                          <img src="${quote.pic_url}" class="d-block align-self-center" alt="Image du carrousel">
                      </div>
                      <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                          <div class="quote-text">
                          <p class="text-white">${quote.text}</p>
                          <h4 class="text-white font-weight-bold">${quote.name}</h4>
                          <span class="text-white">${quote.title}</span>
                          </div>
                      </div>
                      </div>
                  `;

        carouselItem.html(quoteContent);
        carouselInner.append(carouselItem);
      });

      $('#carouselExampleControls').carousel();
    }

    // Fonction pour récupérer les tutoriels populaires
    function fetchPopularTutorials() {
      $.ajax({
        url: "https://smileschool-api.hbtn.info/popular-tutorials",
        dataType: "json",
        success: function (data) {
          displayCustomCarousel(data, "#popular-carousel-track", "#popular-prev-button", "#popular-next-button");
          $(".loader").hide();
        },
        error: function () {
          console.error("Erreur lors de la récupération des tutoriels populaires.");
        }
      });
    }

    function displayCustomCarousel(data, containerId, prevButtonId, nextButtonId) {
      // Valider les données.
      if (!data || !Array.isArray(data)) {
        console.error("Données invalides reçues pour le carrousel.");
        return;
      }

      const $carouselTrack = $(containerId);
      let currentIndex = 0;

      // Afficher les cartes.
      const cardsHTML = data.map(generateCardHTML).join("");
      $carouselTrack.html(cardsHTML);

      // Ajouter des écouteurs d'événements aux boutons de navigation.
      $(prevButtonId).on("click", () => moveCarousel(-1));
      $(nextButtonId).on("click", () => moveCarousel(1));

      function moveCarousel(direction) {
        const cardWidth = $(".carousel-card").outerWidth(true);
        const visibleCards = Math.floor($(".carousel-track-container").width() / cardWidth);
        const totalCards = data.length;

        // Mettre à jour l'index actuel en fonction de la direction.
        currentIndex += direction;

        // Boucle infinie
        if (currentIndex < 0) {
          currentIndex = totalCards - visibleCards; // Aller à la fin
        } else if (currentIndex > totalCards - visibleCards) {
          currentIndex = 0; // Retourner au début
        }

        // Appliquer la transition
        $carouselTrack.css("transition", "transform 0.5s ease-in-out");
        $carouselTrack.css("transform", `translateX(-${currentIndex * cardWidth}px)`);

      }

      // Générer les cartes.
      function generateCardHTML(item) {
        return `
                      <div class="carousel-card col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
                          <div class="card">
                              <img src="${item.thumb_url}" class="card-img-top" alt="Miniature vidéo">

                              <div class="card-img-overlay text-center">
                                  <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                              </div>

                              <div class="card-body">
                                  <h5 class="card-title font-weight-bold">${item.title}</h5>
                                  
                                  <p class="card-text text-muted">
                                      ${item["sub-title"] || ""}
                                  </p>

                                  <div class="creator d-flex align-items-center">
                                      <img src="${item.author_pic_url}" alt="${item.author}" width="30px" class="rounded-circle">
                                      <h6 class="pl-3 m-0 main-color">${item.author}</h6>
                                  </div>

                                  <div class="info pt-3 d-flex justify-content-between">
                                      <div class="rating">
                                          ${generateStars(item.star)}
                                      </div>

                                      <span class="main-color">${item.duration}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `;
      }

      // Générer les étoiles de notation.
      function generateStars(starCount) {
        let stars = "";

        for (let i = 0; i < 5; i++) {
          if (i < starCount) {
            stars += `<img src="images/star_on.png" alt="star" width="15px">`;
          } else {
            stars += `<img src="images/star_off.png" alt="star" width="15px">`;
          }
        }
        return stars;
      }
    }

    // Appels des fonctions pour charger les données
    fetchQuotes();
    fetchPopularTutorials();

    // Fonction pour récupérer les dernières vidéos
    function fetchLatestVideos() {
      $.ajax({
        url: "https://smileschool-api.hbtn.info/latest-videos",
        dataType: "json",
        success: function (data) {
          displayCustomCarousel(data, "#latest-videos-carousel-track", "#latest-videos-prev-button", "#latest-videos-next-button");
          $(".loader").hide(); // Cacher le loader une fois les données chargées
        },
        error: function () {
          console.error("Erreur lors de la récupération des dernières vidéos.");
        }
      });
    }

    // Appeler la fonction pour charger les dernières vidéos
    fetchLatestVideos(); 
  });