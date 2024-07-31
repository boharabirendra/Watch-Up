// tailwind.config.js
module.exports = {
  purge: ['./*.html', './src/**/*.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        navbarcolor: '#009270', 
        bodybgcolor: '#100E0E',
        bglikebtn: '#303030',
        bgdescription: '#2B2A2A',
        bgbuttondisabledcolor: '#272727',
        bgdeletemodal: '#212121',
      },
    },
  },
};
