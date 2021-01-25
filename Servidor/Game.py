import Player
import random

class Magia:
    def __init__(self,confidence,tipo,element):
        self.confidence = confidence
        if tipo == 0:
            self.attack = True
            self.defesa = False
        elif tipo == 1:
            self.defesa = True
            self.attack = False
        self.element = element

class Game:
    def __init__(self,player1Id,player2Id):
        self.player1 = Player(100.0,player1Id)
        self.player2 = Player(100.0,player2Id)

    def compara(self, magia1, magia2):
        dano = 0
        if magia1.confidence > magia2.confidence:
            if magia1.attack and magia2.defesa:
                dano += magia1.confidence - magia2.confidence
            elif magia1.attack and magia2.attack:
            dano += magia1.confidence
            elif magia1.defesa and magia2.defesa:
                dano = 0
            elif magia1.defesa and magia2.attack:
                dano += magia1.confidece - magia2.confidence
            if magia1.tipo > magia2.tipo:
                        dano += CRITICO

    
    def turn(self):
        
        working_letters = ['A','B','C','D','E','I','L','U','W']
        buffedLetter = random.choice(working_letters)
        debuffedLetter = random.choice(working_letters)
        #envio para os clients a vida atual dos dois players e o buffedLetter e a debuffedLetter

        #espero na porta por TIMEOUT segundos; devo receber uma string e um confidence

        #transformar as strings recebidas em magias, criar 
        
        self.player1.setSpell(spellFromClient1)
        self.player2.setSpell(spellFromClient2)

        




        