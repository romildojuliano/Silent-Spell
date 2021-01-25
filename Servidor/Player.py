class Player:
    def __init__(self,healthPoints,id):
        self.healthPoints = healthPoints
        self.id = id
        self.spell = ''
    
    def setSpell(self,newSpell):
        self.spell = newSpell