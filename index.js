/* eslint-disable no-undef */
const puppeteer = require("puppeteer");

const url =
  "https://uocampus.public.uottawa.ca/psc/csprpr9pub/EMPLOYEE/SA/c/UO_SR_AA_MODS.UO_PUB_CLSSRCH.GBL?languageCd=ENG&PortalActualURL=https%3a%2f%2fuocampus.public.uottawa.ca%2fpsc%2fcsprpr9pub%2fEMPLOYEE%2fSA%2fc%2fUO_SR_AA_MODS.UO_PUB_CLSSRCH.GBL%3flanguageCd%3dENG&PortalContentURL=https%3a%2f%2fuocampus.public.uottawa.ca%2fpsc%2fcsprpr9pub%2fEMPLOYEE%2fSA%2fc%2fUO_SR_AA_MODS.UO_PUB_CLSSRCH.GBL&PortalContentProvider=SA&PortalCRefLabel=Public%20Class%20Search&PortalRegistryName=EMPLOYEE&PortalServletURI=https%3a%2f%2fuocampus.public.uottawa.ca%2fpsp%2fcsprpr9pub%2f&PortalURI=https%3a%2f%2fuocampus.public.uottawa.ca%2fpsc%2fcsprpr9pub%2f&PortalHostNode=SA&NoCrumbs=yes&PortalKeyStruct=yes";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  const searchCourse = await page.evaluate(() => {
    const courseSubjectField = document.getElementById(
      "SSR_CLSRCH_WRK_SUBJECT$0",
    );
    courseSubjectField.value = "ITI";

    const courseCodeField = document.getElementById(
      "SSR_CLSRCH_WRK_CATALOG_NBR$0",
    );
    courseCodeField.value = "0";

    const filterSelector = document.getElementById(
      "SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$0",
    );
    filterSelector.value = "G";

    const showClosedCourseSelector = document.getElementById(
      "SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$0",
    );
    showClosedCourseSelector.value = "N";

    const firstYearSelector = document.getElementById(
      "UO_PUB_SRCH_WRK_SSR_RPTCK_OPT_01$chk$0",
    );
    firstYearSelector.value = "Y";

    const submitButton = document.getElementById(
      "CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH",
    );
    submitButton.click();
  });

  await page.waitForSelector(".SSSTEXTBLUE");

  const results = await page.evaluate(() => {
    const table = document.getElementById("ACE_$ICField$4$$0");
    const courses = Array.from(
      table.querySelectorAll(
        "tbody > tr [valign=center], .PAGROUPBOXLABELLEVEL1",
      ),
    );
    const results = [];
    let currentCourseObj = {};

    const all = courses.forEach((el, index) => {
      if (el.className.match(/PAGROUPBOXLABELLEVEL1/)) {
        if (!(index === 0)) {
          results.push(currentCourseObj);
        }

        const section = el.innerText.trim();
        let [courseCode, courseName] = section.split("-");
        courseCode = courseCode.trim().replaceAll(" ", "");
        courseName = courseName.trim();

        currentCourseObj = { courseName, courseCode, components: [] };
      } else {
        const courseData = Array.from(
          el.querySelectorAll(".PSLEVEL3GRIDODDROW"),
        );
        const sectionData = courseData[1].innerText;
        const [componentInfo, sessionType] = sectionData.split("\n");
        const [section, component] = componentInfo.split("-");

        const statusImage = courseData[5].querySelector("img").src;
        const status = statusImage.match(/CLOSED/) || statusImage.match(/OPEN/);
        const componentObj = {
          section,
          component,
          timings: courseData[2].innerText,
          instructor: courseData[3].innerText,
          dates: courseData[4].innerText,
          status: status[0],
        };

        const sectionRegex = /^[A-Z]0[1-9]|[A-Z]1[0-9]$/;
        if (sectionRegex.test(section)) {
          currentCourseObj.components.push(componentObj);
        } else {
          currentCourseObj = { ...currentCourseObj, ...componentObj };
          console.log(currentCourseObj);
        }
      }
    });

    console.log(results);
    return results;
  });

  console.log(results);
})();

// Course object
