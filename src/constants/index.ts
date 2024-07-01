export const MESSAGES = {
    AUTH_ERROR: "Something went wrong, please make sure you are authenticated and try again."
}

export const LATEX_DEFAULT_RESUME_TEMPLATE = `
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{CormorantGaramond}
\\usepackage{charter}
\\usepackage{xcolor}
\\definecolor{accentTitle}{HTML}{0e6e55}
\\definecolor{accentText}{HTML}{0e6e55}
\\definecolor{accentLine}{HTML}{a16f0b}

\\newcommand{\\documentTitle}[2]{
  \\begin{center}
    {\\Huge\\scshape\\color{accentTitle} #1}
    \\vspace{10pt}
    {\\color{accentLine} \\hrule}
    \\vspace{2pt}
    \\footnotesize{#2}
    \\vspace{2pt}
    {\\color{accentLine} \\hrule}
  \\end{center}
}

\\begin{document}

\\documentTitle{%%NAME%%}{
    \\href{%%PORTFOLIO%%}{\\faGlobe\\ Portfolio} ~
    \\href{%%LINKEDIN%%}{\\faLinkedin\\ LinkedIn}
}

\\section{Projects}
%%PROJECTS%%

\\section{Skills}
%%SKILLS%%

\\end{document}
`;