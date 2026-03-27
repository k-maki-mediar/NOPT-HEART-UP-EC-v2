$(function () {
  $('.js-order-history-toggle').on('click', function () {
    var $btn = $(this);
    var $body = $btn.next('.js-order-history-body');
    var isOpen = $btn.attr('aria-expanded') === 'true';

    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('is-open');
  });
});
