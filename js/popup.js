let firstUnits = localStorage.getItem('firstUnits') || 'lbs'
let fixedAmount = parseInt(localStorage.getItem('fixedAmount') || 1)
let result_changed_times = parseInt(localStorage.getItem('result_changed_times') || 0)

let f_input = document.getElementById('input_1')
let s_input = document.getElementById('input_2')

let f_units_label = document.getElementById('top_text')
let s_units_label = document.getElementById('bottom_text')

let logo_label = document.getElementById('logo')

let btn_fix_inc = document.getElementById('fix_inc')
let btn_fix_dec = document.getElementById('fix_dec')
let input_to = f_input;



let was_rated = localStorage.getItem('was_rated') == "yes" ? true : false
// Fixed + and - buttons
const onChangeFixed = value => {
  fixedAmount += value
  const v = input_to.value
  changeInput({ target: { value: v } })
  localStorage.setItem('fixedAmount', fixedAmount)
}

btn_fix_inc.addEventListener('click', e => {
  onChangeFixed(1)
})
btn_fix_dec.addEventListener('click', e => {
  onChangeFixed(-1)
})

// Input
const changeInput = e => {
  let coef = 2.2
  if (firstUnits === 'lbs') {
    coef = 1 / 2.2
  }
  if (s_input == input_to) {
    f_input.value = ((e.target.value * 1) / coef).toFixed(fixedAmount)
  } else {
    s_input.value = (e.target.value * coef).toFixed(fixedAmount)
  }
  result_changed_times += 1;
    console.log(was_rated, result_changed_times % 4)

  if (result_changed_times % 30 == 0 && !was_rated) {
    window.location.href = "./rate_us.html"
  }
  localStorage.setItem('f_input_value', f_input.value)
  localStorage.setItem('s_input_value', s_input.value)
  localStorage.setItem('result_changed_times', result_changed_times)
}

const changeFocusInput = e => {}

const clickInput = e => {
  if (input_to != e.target) {
    navigator.clipboard.writeText(e.target.value).then(() => {
        console.log('Copying to clipboard was successful!');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
  } else {
  }
  input_to = e.target
  ;[
    document.querySelector('.tooltip2'),
    document.querySelector('.tooltip1')
  ].forEach(e => {
    e.style.visibility = 'hidden'
    e.style.opacity = '0'
  })
}

f_input.addEventListener('keyup', changeInput)
s_input.addEventListener('keyup', changeInput)

f_input.addEventListener('focus', changeFocusInput)
s_input.addEventListener('focus', changeFocusInput)

f_input.addEventListener('click', clickInput)
s_input.addEventListener('click', clickInput)

const swapUnits = withSaving => {
  console.log('change units')
  if (firstUnits === 'lbs') {
    firstUnits = 'kg'
    logo_label.innerText = 'KG TO LBS'
    f_units_label.innerText = 'kg'
    s_units_label.innerText = 'lbs'
  } else {
    firstUnits = 'lbs'
    logo_label.innerText = 'LBS TO KG'
    f_units_label.innerText = 'lbs'
    s_units_label.innerText = 'kg'
  }
  const v = s_input.value
  s_input.value = f_input.value
  f_input.value = v
  if (withSaving) {
    localStorage.setItem('firstUnits', firstUnits)
  }
}

// Swap button
$('#btn_swap').on('click', e => {
  swapUnits(true)
})

// Tooltip
document
  .querySelector('#input_1')
  .addEventListener('mousemove', function (event) {
    var tooltip = document.querySelector('.tooltip1')
    if (input_to.id == 'input_1') {
      tooltip.style.visibility = 'hidden'
      return
    }
    var inputRect = this.getBoundingClientRect()
    tooltip.style.left = event.clientX - inputRect.left + 45 + 'px'
    tooltip.style.top = event.clientY - inputRect.top + 120 + 'px'
    tooltip.style.visibility = 'visible'
    tooltip.style.opacity = '1'
  })

document.querySelector('#input_1').addEventListener('mouseout', function () {
  var tooltip = document.querySelector('.tooltip1')
  tooltip.style.visibility = 'hidden'
  tooltip.style.opacity = '0'
})

// Tooltip
document
  .querySelector('#input_2')
  .addEventListener('mousemove', function (event) {
    var tooltip = document.querySelector('.tooltip2')
    if (input_to.id == 'input_2') {
      tooltip.style.visibility = 'hidden'
      return
    }
    var inputRect = this.getBoundingClientRect()
    tooltip.style.left = event.clientX - inputRect.left + 45 + 'px'
    tooltip.style.top = event.clientY - inputRect.top + 120 + 'px'
    tooltip.style.visibility = 'visible'
    tooltip.style.opacity = '1'
  })

document.querySelector('#input_2').addEventListener('mouseout', function () {
  var tooltip = document.querySelector('.tooltip2')
  tooltip.style.visibility = 'hidden'
  tooltip.style.opacity = '0'
})

// Initialization of script
function initialize () {
  if (firstUnits !== 'lbs') {
    firstUnits = 'lbs'
    swapUnits(true)
  }
  const fval = localStorage.getItem('f_input_value')
  const sval = localStorage.getItem('s_input_value')
  if (fval) {
    f_input.value = parseFloat(fval)
    s_input.value = parseFloat(sval).toFixed(fixedAmount)
  }
  chrome.tabs.getCurrent(function (tab) {
    if (tab) {
      $('.body').toggleClass('body-full-screen')
      $('.bodyframe').addClass('bodyframe-full-screen')
      openFull.style.display = 'none'
    } else {
      openFull.addEventListener('click', function (e) {
        chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') })
    })
    }
  })
}

initialize()
