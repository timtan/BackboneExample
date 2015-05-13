# Django example with backbone

This is a bootstrap example with backbone

## INSTALLATION & SETTINGS

     you need to install pip and virtualenv first

### Setting Virtualenv

At first, you should make sure you have [virtualenv](http://www.virtualenv.org/) installed. Then create your virtualenv:

    virtualenv venv
    
Second, you need to enable the virtualenv by

	source venv/bin/activate
	
    pip install -r requirements/local.txt

	cd django_backbone_example

	python manage.py migrate   # do it once is enough
	python manage.py runserver   
