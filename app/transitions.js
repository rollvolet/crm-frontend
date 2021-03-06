export default function(){
  this.transition(
    this.hasClass('data-table-selection'),
    this.toValue(true),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.hasClass('expand-more'),
    this.toValue(true),
    this.use('toDown'),
    this.reverse('toUp')
  );

  this.transition(
    this.hasClass('move-up'),
    this.toValue(true),
    this.use('toUp'),
    this.reverse('toUp')
  );
}
