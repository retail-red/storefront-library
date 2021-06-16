import countriesList from 'i18n-iso-countries/langs/ru.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  format: {
    decimalSymbol: ',',
    groupSymbol: ' ',
  },
  date: {
    mon: 'понедельник',
    tue: 'вторник',
    wed: 'среда',
    thu: 'четверг',
    fri: 'пятница',
    sat: 'суббота',
    sun: 'воскресенье',
  },
  addresses: {
    line1: '{{street}}',
    line2: '{{street2}}',
    line3: '{{city}}, {{postalCode}}',
    tel: 'Тел.:',
  },
  errors: {
    unknown: 'Не удалось отправить заказ',
    validation: {
      isRequired: 'Обязательное поле',
      isEmail: 'Неверный формат адреса электронной почты',
      isPhone: 'Неверный формат номера телефона',
    },
  },
  storeList: {
    title: 'Найти магазин рядом с вами',
    emptyList: 'В текущем местоположении магазинов поблизости не найдено',
    quantity: 'Кол-во',
    uncollapse: 'Показать информацию о магазине',
    collapse: 'Скрыть информацию о магазине',
    reserve: 'Зарезервировать',
    select: 'Выбрать',
    comingSoon: 'Скоро доступен',
    location: {
      address: ' Адрес',
      storeHours: 'Часы работы магазина',
      directions: 'Маршруты',
    },
    search: {
      label: 'Почтовый индекс',
      countryLabel: 'Страна',
      buttonLabel: 'Поиск',
    },
    inventory: {
      available: 'доступно',
      unavailable: 'Недоступно',
      exact: 'Доступно ({{x}})',
      rough: 'Доступно ({{x}}+)',
    },
  },
  reserveButton: {
    title: 'Зарезервировать и забрать',
  },
  reserve: {
    title: 'Отправить заказ',
    changeStore: 'Изменить магазин',
    contactInfo: 'Контактная информация',
    pickupQuestion: 'Кто заберет заказ?',
    me: 'Я',
    someoneElse: 'Кто-то другой',
    pickupInfo: 'Данные контактного лица',
    firstName: 'Имя',
    lastName: ' Фамилия',
    phoneNumber: ' Номер телефона',
    email: 'Адрес электронной почты',
    submit: 'Отправить заказ',
    terms: {
      text: 'Я прочитал и принял условия {{child}}',
      link: 'Условия',
    },
    privacy: {
      text: 'Я прочитал и принял {{child}}',
      link: 'Политика конфиденциальности',
    },
  },
  success: {
    title: 'Подтверждение заказа',
    headline: 'Спасибо за ваш заказ',
    text: 'Мы отправим вам электронное/текстовое сообщение в ближайшее время, когда ваш заказ будет готов',
    reservationNumber: 'Номер вашего заказа:',
    location: {
      address: 'Адрес',
      phone: 'Телефон',
      storeHours: 'Часы работы магазина',
      directions: 'Маршруты',
    },
  },
  liveInventory: {
    searchPostalCode: 'Показать наличие в ближайших магазинах',
    searchDirect: 'Показать наличие в выбранном магазине',
    postalCode: 'Почтовый индекс',
    reserveOther: 'Проверить другие магазины',
    find: 'Найти магазин',
    yourStore: 'Выбранный магазин:',
    change: 'Изменить',
    select: 'Выберите магазин',
    pleaseSelect: 'Пожалуйста, выберите магазин',
    cancel: 'Отменить',
    list: {
      unavailable: '(недоступен)',
      comingSoon: '(скоро доступен)',
    },
  },
};
