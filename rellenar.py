from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

# Configuración del navegador (en este caso, Chrome)
driver = webdriver.Edge('C:\Program Files (x86)\Microsoft\Edge\Application')

# Abre la URL
driver.get('http://127.0.0.1:8000/api/question/')

# Encuentra los campos del formulario y llena los datos
campo1 = driver.find_element(By.NAME, 'content')
campo1.send_keys('valor1')

campo2 = driver.find_element(By.NAME, 'type')
campo2.send_keys('valor2')

campo2 = driver.find_element(By.NAME, 'difficulty')
campo2.send_keys('valor2')

campo2 = driver.find_element(By.NAME, 'teacher')
campo2.send_keys('valor2')

campo2 = driver.find_element(By.NAME, 'topic')
campo2.send_keys('valor2')

campo2 = driver.find_element(By.NAME, 'subject')
campo2.send_keys('valor2')


# Puedes seguir llenando otros campos de manera similar

# Envía el formulario
campo1.send_keys(Keys.RETURN)

# Cierra el navegador después de enviar el formulario
driver.quit()
#datos de la tabla 
#Teacher
# id   Nombre
# 31   Fernando
# 32   Margarita
# 33   juan
# 34   Sol
#Subject
