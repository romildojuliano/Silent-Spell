from Player import Player
import random

class Spell:
    def __init__(self,confidence,type,element):
        self.confidence = confidence
        self.type = type
        if type == 'A':
            self.attack = True
            self.defense = False
        elif type == 'D':
            self.defense = True
            self.attack = False
        self.element = element

class Game:
    def __init__(self,player1Id,player2Id):
        self.player1 = Player(100.0,player1Id)
        self.player2 = Player(100.0,player2Id)
        spells = 'EILUW LUCBE BLICB UWLCE CLUWI IBLBC'
        spells = spells.split(' ')
        trigrams = []
        for spell in spells:
            aux = []
            aux.append('_'+spell[0:2])
            for i in range(1,len(spell)-1):
                aux.append(spell[i-1:i+2])
            aux.append(spell[len(spell)-2:len(spell)] + '_')
            trigrams.append(aux)
        self.trigrams = trigrams
        self.spells = spells

    def decodeSpell(self,x):
        trigram = []
        trigram.append('_'+x[0:2])
        for i in range(1,len(x)-1):
            trigram.append(x[i-1:i+2])
        trigram.append(x[len(x)-2:len(x)] + '_')

        spells = []
        for j in range(len(self.trigrams)):
            contador = 0
            for i in range(5):
                if i < len(trigram) and self.trigrams[j][i] == trigram[i]:
                    contador+=1
            spells.append(contador)
        
        #print("mais proxima é sem duvidas: ", self.spells[spells.index(max(spells))])
        return spells.index(max(spells))

    def compara(self, spell1, spell2):
        CRITICO = 10
        damage = 0
        if spell1.confidence > spell2.confidence:
            if spell1.attack and spell2.defense:
                damage += spell1.confidence - spell2.confidence
            elif spell1.attack and spell2.attack:
                damage += spell1.confidence
            elif spell1.defense and spell2.defense:
                damage = 0
            elif spell1.defense and spell2.attack:
                damage += spell1.confidence - spell2.confidence
            #if spell1.element > spell2.element:
            #            damage += CRITICO
            return damage, 0
        elif spell2.confidence > spell1.confidence:
            if spell2.attack and spell2.defense:
                damage += spell2.confidence - spell1.confidence
            elif spell2.attack and spell1.attack:
                damage += spell2.confidence
            elif spell2.defense and spell1.defense:
                damage = 0
            elif spell2.defense and spell1.attack:
                damage += spell2.confidence - spell1.confidence
            #if spell2.element > spell2.element:
            #    damage += CRITICO
            return 0, damage

        return 0, 0
    #envio para os clients a vida atual dos dois players e o buffedLetter e a debuffedLetter
    #def send(self,buffedLetter,debuffedLetter,healthPoints1,healthPoints2):
    #   send this to both clients 


    def start_turn(self):
        #send(buffedLetter, debuffedLetter, self.player1.healthPoints, self.player2.healthPoints)
        working_letters = ['A','B','C','D','E','I','L','U','W']
        buffedLetter = random.choice(working_letters)
        debuffedLetter = random.choice(working_letters)
        return (buffedLetter, debuffedLetter)
    
    def end_turn(self, spellFromClient1, spellFromClient2):
        #espero na porta por TIMEOUT segundos; devo receber uma string e um confidence

        #transformar as strings recebidas em spells, criar 
        s1Index = self.decodeSpell(str(spellFromClient1.element))
        s2Index = self.decodeSpell(str(spellFromClient2.element))
        self.player1.setSpell(s1Index)
        self.player2.setSpell(s2Index)
        spell1 = Spell(spellFromClient1.confidence, spellFromClient1.type, self.spells[s1Index])
        spell2 = Spell(spellFromClient2.confidence, spellFromClient2.type, self.spells[s2Index])
        
        damage1, damage2 = self.compara(spell1,spell2)
        print('damage1 = %s, damage2 = %s'%(damage1, damage2))
        self.player1.updateHealthPoints(damage1*10)
        self.player2.updateHealthPoints(damage2*10)

        return (self.player1.healthPoints, self.player2.healthPoints)
