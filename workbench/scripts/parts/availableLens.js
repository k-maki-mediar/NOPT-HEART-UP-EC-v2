$(function () {
  $('.js-available-lens-toggle').on('click', function () {
    var $btn = $(this);
    var $body = $btn.next('.js-available-lens-body');
    var isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('is-open');
  });
});
