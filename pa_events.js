var currentScriptRef = document.currentScript;
var ECB = window.ECB || {};

ECB.paEvents = {
  isLoaded: false,
  load: function () {
    try {
      let paSiteId = currentScriptRef.getAttribute("data-siteID");
      let cDate = new Date();
      let versionId = cDate.getMonth() + "_" + cDate.getDate();

      try {
        let currentSrcParams = new URL(currentScriptRef.src).searchParams;
        if (currentSrcParams.has("v")) {
          versionId = currentSrcParams.get("v");
        }
      } catch (oldBrowserExp) { }

      let paCollectionDomain = currentScriptRef.getAttribute("data-collectDomain");
      if (!ECB.paEvents.isLoaded && ECB.slow.cookies.hasAcceptedCookies()) {
        ECB.paEvents.isLoaded = true;

        var paScript = document.createElement("script");
        paScript.src =
          "https://tag.aticdn.net/js-sdk/piano-analytics-6.10.0.js";
        paScript.crossorigin = "anonymous";
        paScript.onload = function () {
          pa.setConfiguration("site", paSiteId);
          pa.setConfiguration("collectDomain", paCollectionDomain);

          import("./pa_core.js?v=" + versionId).then((evh) => {
            let tr = new evh.PAEventHandlers();

            try {
              // Tags for action banner
              if (window.location.href.includes("/home/html/index.")) {
                tr.ClickAnchor("div.call-to-action", "a", "Action banner");
                tr.ClickAnchor("div.call-to-action-v2", "a", "Action banner");
              }

              // Whistleblowing banner
              if (window.location.href.includes("bankingsupervision.europa.eu")) {
                tr.ClickAnchor("a.notification.-yellow-black", "div.content-box", "Whistleblowing banner");
              }

              // tracks the scroll percentage on a specific page. It is called for every page
              tr.ScrollPercentage();

              // tracks the page display of  a specific page. It is called for every page
              tr.Display();

              // tracks clicks on the footer. It is called for every page
              tr.ClickAnchor("footer", "a", "Footer", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href)
              });

              // Click on feedback buttons, different options all at one level - difficult to differentiate by sending some click 2nd level conditioned on "No" being clicked
              tr.Click("#feedback-yes", "Feedback - Yes", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });
              tr.Click("#feedback-no", "Feedback - No", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });
              tr.Click("#feedback-broken", "Feedback - Page not working", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });
              tr.Click(
                "#feedback-content",
                "Feedback - Information not useful",
                {
                  currentPageURL: window.location.href,
                  currentPageID: tr.removeSubstringAndAfter(
                    window.location.href
                  ),
                }
              );
              tr.Click("#feedback-design", "Feedback - Design not attractive", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });
              tr.Click("#feedback-other", "Feedback - Something else", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });

              // Click on All pages in this section at all pages for which such a section at the bottom of the page exists
              tr.ClickAnchor(
                "#pages-in-section-holder",
                ".content-box ul li a",
                "All pages in this section",
                {
                  currentPageURL: window.location.href,
                  currentPageID: tr.removeSubstringAndAfter(
                    window.location.href
                  ),
                }
              );

              // For safety that we won't encounter anywhere else the same structure, filter for the homepage first
              if (window.location.href.includes("home/html/index")) {
                // Clicks on homepage boxes inside in focus - differentiates between boxes by sending along the destinationURL inside the trClickHomeBoxes, a dedicated function for the homepage boxes.
                tr.ClickHomeBoxes(
                  ".tab-content .boxes",
                  "Homepage box - In focus",
                  { once: true }
                );
                // Click on homepage slider only including the main promotion - changing all the time but can't make trClickAnchor work so did it with trClick and without sending the href as well for this one
                tr.ClickAnchor2(
                  ".slider_content_container",
                  "Slider Button Clicked"
                );
              }

              // clicks to the ECBot in the pages that is found
              tr.ClickChatbot();

              // href patterns implementations. Split the patterns in click.action and click. download events, after definitions call the tHrefpatterns for each of the cases to send to Piano what's needed
              // url patterns example for click.action events, followed by the clicks to the functions
              var actionUrlPatterns = [
                //some of Ivan's examples
                {
                  pattern:
                    /(stats\/ecb_statistics\/escb\/html\/table\.[^.]+\.html\?id=JDF_)/,
                  click: "ECB stats report",
                  additional_info1: "Some info",
                  additional_info2: "Some info",
                },
                {
                  pattern:
                    /(euro_reference_exchange_rates\/html\/eurofxref-graph-usd\.[^.]+\.html)/,
                  click: "Euro exchange USD graph",
                  additional_info: "asdas",
                },
                //next is for the tags regarding clicks to external links
                {
                  pattern:
                    /^(?!.*ecb\.europa\.eu|.*ecbwork\.ecb\.de|.*ecb-internal\.ecb\.de|.*esrb\.europa\.eu|.*bankingsupervision\.europa\.eu).+/,
                  click: "External Link Clicked",
                  additional_info: "This is an external link",
                },
                {
                  pattern: /.*multimedia\.ecb\.europa\.eu\//,
                  click: "DAM Link Clicked",
                  additional_info: "This is a click on a DAM link"
                },
              ];

              // url patterns example for click.download events
              var downloadUrlPatterns = [
                // put here for the major patterns like pdf, csv, xls and so on
                {
                  pattern: /\.pdf(\?|#|$)/,
                  fileType: "PDF",
                  additional_info: "User clicked a PDF link",
                },
                {
                  pattern: /\.xml(\?|#|$)/,
                  fileType: "XML",
                  additional_info: "User clicked an XML link",
                },
                {
                  pattern: /\.xls(x)?(\?|#|$)/,
                  fileType: "XLS",
                  additional_info: "User clicked an XLS link",
                },
                {
                  pattern: /\.csv(\?|#|$)/,
                  fileType: "CSV",
                  additional_info: "User clicked a CSV link",
                },
                {
                  pattern: /\.zip(\?|#|$)/,
                  fileType: "ZIP",
                  additional_info: "User clicked a ZIP link",
                },
                {
                  pattern: /\.epub(\?|#|$)/,
                  fileType: "EPUB",
                  additional_info: "User clicked an EPUB link",
                },
                {
                  pattern: /\.rss(\?|#|$)/,
                  fileType: "RSS",
                  additional_info: "User clicked an RSS link",
                },
              ];

              // Use the same function for both action and download patterns
              tr.ClickHrefPatterns(actionUrlPatterns, "click.action");
              tr.ClickHrefPatterns(downloadUrlPatterns, "click.download");
            } catch (calsExp) {
              console.log(calsExp);
            }

            let currentUrl = window.location.href;

            // ECB
            if (
              currentUrl.indexOf("ecb-staging.ecb") > -1 ||
              currentUrl.indexOf("ecb-internal.ecb") > -1 ||
              currentUrl.indexOf("ecb.europa.eu") > -1 ||
              currentUrl.indexOf("wsaxp022.ecb01.ecb.de:85") > -1
            ) {
              // Tracking clicks on right menu of the FSR
              if (
                window.location.href.includes(
                  "/financial-stability-publications/fsr/html/ecb.fsr"
                )
              ) {
                tr.ClickAnchor_FSR(
                  ".pub-side-nav",
                  "a",
                  "FSR - Jump to section"
                );
              }

              // Tracking download of the file containing all ECB speeches
              if (window.location.href.includes("/press/key/date/html/index")) {
                tr.Click("div.section", "Speeches dataset download");
              }

              // Can slightly adapt it and use it for the BaSu website as well
              // Tag for statistics box
              if (window.location.href.includes("/home/html/index.")) {
                tr.ClickAnchor(
                  ".statistics-box .box:nth-child(1)",
                  "a",
                  "Click on Homepage blue box",
                  { labelName: "Past key ECB interest rates" }
                );

                tr.ClickAnchor(
                  ".statistics-box .box:nth-child(2)",
                  "a",
                  "Click on Homepage blue box",
                  { labelName: "Inflation Dashboard" }
                );

                tr.ClickAnchor(
                  ".statistics-box .box:nth-child(3)",
                  "a",
                  "Click on Homepage blue box",
                  { labelName: "Rates" }
                );

                tr.ClickAnchor(
                  ".statistics-box .box:nth-child(4)",
                  "a",
                  "Click on Homepage blue box",
                  { labelName: "FinsStab" }
                );
              }

              // tracks clicks on the top navigation menu
              tr.ClickTopNavigationMenu();

              // Click on the See also boxes in this page: https://www.ecb.europa.eu/ecb/orga/decisions/eb/html/index.en.html. No destination URL required as they are only two boxes - update if we also want to know which specific box
              tr.Click(
                "div.see-also-boxes.-two-columns > div.container",
                "See also boxes clicked",
                { currentPageURL: window.location.href }
              );

              // For safety that we won't encounter anywhere else the same structure, filter for the homepage first
              if (window.location.href.includes("home/html/index")) {
                // Clicks on the homepage carousel, not being able to differentiate which box it is
                tr.ClickAnchor(
                  ".items.flickity-enabled.is-draggable",
                  "a",
                  "Homepage Carousel Box"
                );
                // call the function that logs the clicks to the labels of homepage (In focus, Press Releases, etc)
                tr.ClickHomepageLabels();
              }

              // Call the trClickAnchor function for the related topics section
              tr.ClickAnchor(
                "div.related-topics",
                "a.taxonomy-tag",
                "Related Topic - Taxonomy tag"
              );

              // Click on phone number on Contacts page
              if (window.location.href.includes("contacts/html/index")) {
                tr.Click(
                  'a[href="tel:+496913441300"]',
                  "Telephone on Contacts page"
                );
              }

              // Click on different boxes on Ask us page
              // Using the Label name as the extra property to not create multiple new ones in Piano - the label name is also used e.g. for the homepage labels to differentiate in Piano between them
              if (window.location.href.includes("ask_us/html/index")) {
                tr.Click('a[href="#about"]', "What we do - Ask us", {
                  labelName: "About the ECB",
                });
                tr.Click('a[href="#monpol"]', "What we do - Ask us", {
                  labelName: "Monetary policy",
                });
                tr.Click('a[href="#basu"]', "What we do - Ask us", {
                  labelName: "Banking supervision",
                });
                tr.Click('a[href="#euro"]', "What we do - Ask us", {
                  labelName: "The euro and payment systems",
                });
                tr.Click('a[href="#climate"]', "What we do - Ask us", {
                  labelName: "Climate change",
                });
                tr.Click('a[href="#corona"]', "What we do - Ask us", {
                  labelName: "Our coronavirus response",
                });
                tr.Click("div.button-box", "How can you reach us? - Ask us");
              }

              // Clicks on the Facts in Focus box at the statistics page
              if (window.location.href.includes("stats/html/index")) {
                tr.ClickBoxes(".combo-box .upper", "Facts in Focus", {
                  once: true,
                });
              }

              // Tags for the new explainers - for safety lt's put everything inside the if condition to make sure we trigger things only on the explainers page
              if (
                window.location.href.includes(
                  "ecb-and-you/explainers/html/index"
                )
              ) {
                // Clicks on the three tags under "on this page" to see where people navigate in the page
                tr.Click('a[href="#new"]', "Explainers - Latest topics");
                tr.Click('a[href="#paths"]', "Explainers - Learning paths");
                tr.Click('a[href="#most"]', "Explainers - Most read");

                // Clicks on the two featured boxes, as in other cases with such boxes, have to separate the data-image and h3 from the a. The second box is entirely clickable and is taken care of with the trClickAnchor call
                tr.ClickBoxes(".upper", "Featured explainer clicked", {
                  once: true,
                });
                tr.ClickBoxes(".lower", "Featured explainer clicked", {
                  once: true,
                });

                // This is for clicking the "list of explainers" link on the main page. For some reason, it doesn't work with the usual way of calling the trClickAnchor with the closest div to grab the href inside a.
                // The following worked, not sure why.
                document
                  .querySelector("main")
                  .addEventListener("click", function (event) {
                    let target = event.target;
                    if (target.tagName === "A" && target.closest(".section")) {
                      pa.sendEvent("click.action", {
                        click: "List of explainers clicked",
                        ...options,
                      });
                    }
                  });
              }

              // ESRB
            } else if (
              currentUrl.indexOf("esrb-staging.ecb") > -1 ||
              currentUrl.indexOf("esrb-internal.ecb") > -1 ||
              currentUrl.indexOf("esrb.europa.eu") > -1 ||
              currentUrl.indexOf("wsaxp022.ecb01.ecb.de:96") > -1
            ) {
              // Click on the homepage banner (from any page, since the banner exists everywhere). Sends along some options, combined with two more for the destination URL, which are sent directly from the trClickAnchor function
              // Same for BaSu and ESRB, which have the old navigation menu.
              tr.ClickAnchor("#ecb-mainnavwrapper", "a", "Banner Clicked", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });

              // Clicks on the hamburger buttons (without necessarily meaning that a visitor clicks on anything that opens up)
              tr.Click("#hamburger", "Hamburger Button Clicked", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });

              // BaSu
            } else if (
              currentUrl.indexOf("ssm-staging.ecb") > -1 ||
              currentUrl.indexOf("ssm-internal.ecb") > -1 ||
              currentUrl.indexOf("bankingsupervision.europa.eu") > -1 ||
              currentUrl.indexOf("wsaxp022.ecb01.ecb.de:90") > -1
            ) {
              // Click on the homepage banner (from any page, since the banner exists everywhere). Sends along some options, combined with two more for the destination URL, which are sent directly from the trClickAnchor function
              // Same for BaSu and ESRB, which have the old navigation menu.
              tr.ClickAnchor("#ecb-mainnavwrapper", "a", "Banner Clicked", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });

              // Clicks on the hamburger buttons (without necessarily meaning that a visitor clicks on anything that opens up)
              tr.Click("#hamburger", "Hamburger Button Clicked", {
                currentPageURL: window.location.href,
                currentPageID: tr.removeSubstringAndAfter(window.location.href),
              });

              // For safety that we won't encounter anywhere else the same structure, filter for the homepage first
              if (window.location.href.includes("home/html/index")) {
                // call the function that logs the clicks to the labels of homepage (In focus, Press Releases, etc)
                tr.ClickHomepageLabels();
              }

              // Click on phone number on Contacts page
              if (window.location.href.includes("contacts/html/index")) {
                tr.Click(
                  'a[href="tel:+496913441300"]',
                  "Telephone on Contacts page"
                );
              }

              // tracks clicks on the top navigation menu
              tr.ClickTopNavigationMenu();
            }
          });
        };

        document.head.appendChild(paScript);
      }
    } catch (mainExp) {
      console.log(mainExp);
    }
  }
};


if (document.readyState === "complete") {
  ECB.paEvents.load();
} else {
  window.addEventListener("load", ECB.paEvents.load);
}