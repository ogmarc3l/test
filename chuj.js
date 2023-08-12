const Main = {};
Main.init = ()=>{
    $(".navbar_phone_burger").on("click", function() {
        var nav = $(".navbar");
        if (!nav.hasClass("navbar_mobile")) {
            nav.addClass("navbar_mobile");
        } else {
            nav.removeClass("navbar_mobile");
        }
    })
    $("#shop-button").on("click", ()=>{
        const shop = $('#shop');
        if (shop.length > 0)
            $('html, body').animate({
                scrollTop: shop.offset().top
            }, 'slow');
        else
            window.location.href = '../';
    }
    );
    $(".mc_btn").click(function() {
        var audio = new Audio('../assets/audio/sound_mc_click.mp3');
        audio.play();
    });
    const sections = document.querySelectorAll(".sectioner");
    function handleClick(e) {
        if (e.target && (e.target.dataset.section || e.target.parentElement.dataset.section)) {
            const sectionId = e.target.dataset.section || e.target.parentElement.dataset.section;
            sections.forEach(section=>{
                if (section.dataset.section === sectionId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            }
            );
            const sectionToOpen = document.querySelector(`[data-section="${sectionId}"]`);
            sectionToOpen.classList.add("active");
        }
    }
    document.addEventListener("click", handleClick);
}
;
Main.shop = (json)=>{
    Object.entries(json).forEach(entry=>{
        const serverName = entry[0];
        Object.entries(entry[1]).forEach(shop=>{
            let currentPayment = "transfer";
            const keys = Object.keys(shop[1].price);
            const prices = Object.values(shop[1].price);
            let service = prices[0];
            const id = `${serverName}_ ${shop[0]}`
            $(`input[type=radio][data-rpayment=${id}]`).on('change', function() {
                currentPayment = $(this).val();
                $(`.cost[data-payment=${id}]`).text(Number(service[currentPayment]).toFixed(2));
            });
            if (prices.length < 2)
                return
            const slider = $(`.slider[data-slider=${id}]`);
            $(`.shop_slider_min[data-slider=${id}]`).text("1");
            $(`.shop_slider_max[data-slider=${id}]`).text("" + prices.length);
            slider.attr('max', prices.length);
            slider.on('input', event=>{
                const min = event.target.min
                  , max = event.target.max
                  , val = event.target.value;
                service = prices[val - 1];
                $(`.shop_slider_output[data-slider=${id}]`).text(keys[val - 1]);
                $(`.cost[data-payment=${id}]`).text(Number(service[currentPayment]).toFixed(2));
                $(`input[data-payment=${id}]`).val(service["id"]);
                $(event.target).css({
                    'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
                });
            }
            ).trigger('input');
        }
        )
    }
    )
}
$(()=>{
    Main.init();
}
);
