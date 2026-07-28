//Team Data
const team = [
  {
    id: "anna",
    fullName: "Anna Kendrick",
    jobTitle: "Front-end Ninja",
    bio: "Bibliophile, loves to dive into fictional worlds, ships JS code like brownies",
    avatar: "./avataaars/annakendrick.svg",
  },
  {
    id: "harry",
    fullName: "Harry Fawn",
    jobTitle: "Illustrator",
    bio: "Creates new illustrations each week, will kill for coffee, and loves beaches",
    avatar: "./avataaars/harryfn.svg",
  },
  {
    id: "sofia",
    fullName: "Sofia Sultan",
    jobTitle: "Backend Engineer",
    bio: "Donuts over waffles. Martinis over whiskeys. Typescript over anything.",
    avatar: "./avataaars/sofiasul.svg",
  },
];

//Modify Code below this line

//Content Selected using ID.
const content = document.getElementById("content");

/**
 * Creates and img HTML element with given src and alt
 * @param {string} src - Source for image
 * @param {string} alt - Alt text for image
 * @returns An Image HTML Element
 */
const getImageElement = (src, alt) => {
  const imgEle = document.createElement("img");
  imgEle.src = src;
  imgEle.alt = alt;
  return imgEle;
};

/**
 * Creates a new card with passed parameters.
 * @param {string} id - Unique id from team data
 * @param {string} fullName - Name of the team member
 * @param {string} jobTitle - Job title of the team memeber
 * @param {string} bio - Description Bio
 * @param {string} avatar - Source of the avatar image.
 * @returns section HTML element with Image and Text
 */
function generateCard(id, fullName, jobTitle, bio, avatar) {
  //1. Create a new "section" element and set the className and id
  const TeamMemberSection = document.createElement("section");
  TeamMemberSection.className = "team-member";
  TeamMemberSection.id = id;
  //2. Generate the image using getImageElement() function
  const generatedImg = getImageElement(avatar, fullName);

  //Hint - Use fullname as alt for the image.

  //3. Create a div for text content
  const divEle = document.createElement("div");

  //4. Create an h2 for fullName
  const fullNameHeading = document.createElement("h2");

  //5. Create an h3 for jobTitle
  const jobTitleHeading = document.createElement("h3");
  //6. Create a p for bio
  const bioHeading = document.createElement("p");

  //7. Append the fullName, jobTitle, and bio element
  //   to the div created for text.
  fullNameHeading.textContent = fullName;
  jobTitleHeading.textContent = jobTitle;
  bioHeading.textContent = bio;
  //8. Append the Image and the Text div
  TeamMemberSection.appendChild(generatedImg);
  divEle.appendChild(fullNameHeading);
  divEle.appendChild(jobTitleHeading);
  divEle.appendChild(bioHeading);
  TeamMemberSection.appendChild(divEle);

  //   to the new section you created in step 1

  //Return the new section element created.
  return TeamMemberSection;
}

/**
 * Generates and returns an array of HTML elements
 * @param {Array} data Team data array
 */
function generateCardArray(data) {
  const cards = [];
  //Add logic to populate `cards` array below
  for (const member of data) {
    cards.push(
      generateCard(
        member.id,
        member.fullName,
        member.jobTitle,
        member.bio,
        member.avatar,
      ),
    );
  }

  //Return cards array
  return cards;
}

const cardsArray = generateCardArray(team);

//Run a loop for the cardsArray and append its elements to content.
for (let card of cardsArray) {
  content.append(card);
}
//Modify Code above this line
