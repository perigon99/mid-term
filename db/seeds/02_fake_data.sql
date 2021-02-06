insert into users (name, email, password, telephone)
values
('Chris', 'c@c.com','password', '5144624478'),
('Sebas', 's@c.com','password','5144624478'),
('Alex', 'a@c.com','password','5144624478');

insert into orders (users_id)
values
(1),
(2),
(3);

insert into menu_items (name, price, prep_time,type_plate)
values
('Osso Bucco', 55, 60, 'main'),
('Foie gras with truffles', 25, 10, 'entry'),
('Olypus Cheeze cake', 15, 5, 'dessert'),
('Petrus 1994', 5995, 5, 'wine'),
('Royal duck', 75, 60, 'main'),
('Selection of cheeses', 35, 10, 'entry'),
('Wild salmon tartare', 85, 60, 'main'),
('Paris Brest', 25, 60, 'dessert'),
('Dom Perignion', 455, 5, 'wine');

insert into orders_content (orders_id, menu_item_id)
values
(1,1),
(1,4),
(1,5),
(1,2),
(1,7),
(2,1),
(2,2),
(2,3),
(3,4),
(3,5),
(3,6),
(3,7);
