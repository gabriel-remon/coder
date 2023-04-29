
import hbs  from 'hbs';

hbs.registerHelper('getCategories', function(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const options = categories.map(c => `<option value="${c}">${c}</option>`);
  return new hbs.SafeString(options.join(''));
});