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
        magias = 'EILUW LUCBE BLICB UWLCE CLUWI IBLBC'
        magias = magias.split(' ')
        trigramas = []
        for spell in magias:
            aux = []
            aux.append('_'+spell[0:2])
            for i in range(1,len(spell)-1):
                aux.append(spell[i-1:i+2])
            aux.append(spell[len(spell)-2:len(spell)] + '_')
            trigramas.append(aux)
        self.trigramas = trigramas
        self.magias = magias

    def decodificaMagia(self,x):
        trigrama = []
        trigrama.append('_'+x[0:2])
        for i in range(1,len(x)-1):
            trigrama.append(x[i-1:i+2])
        trigrama.append(x[len(x)-2:len(x)] + '_')

        spells = []
        for j in range(len(self.trigramas)):
            contador = 0
            for i in range(5):
                if i < len(trigrama) and self.trigramas[j][i] == trigrama[i]:
                    contador+=1
            spells.append(contador)
        
        #print("mais proxima é sem duvidas: ", self.magias[spells.index(max(spells))])
        return spells.index(max(spells))

    def compara(self, magia1, magia2):
        CRITICO = 10
        dano = 0
        if magia1.confidence > magia2.confidence:
            if magia1.attack and magia2.defesa:
                dano += magia1.confidence - magia2.confidence
            elif magia1.attack and magia2.attack:
                dano += magia1.confidence
            elif magia1.defesa and magia2.defesa:
                dano = 0
            elif magia1.defesa and magia2.attack:
                dano += magia1.confidence - magia2.confidence
            #if magia1.element > magia2.element:
            #            dano += CRITICO
            return dano, 0
        elif magia2.confidence > magia1.confidence:
            if magia2.attack and magia2.defesa:
                dano += magia2.confidence - magia1.confidence
            elif magia2.attack and magia1.attack:
                dano += magia2.confidence
            elif magia2.defesa and magia1.defesa:
                dano = 0
            elif magia2.defesa and magia1.attack:
                dano += magia2.confidence - magia1.confidence
            #if magia2.element > magia2.element:
            #    dano += CRITICO
            return 0, dano

    #envio para os clients a vida atual dos dois players e o buffedLetter e a debuffedLetter
    #def send(self,buffedLetter,debuffedLetter,healthPoints1,healthPoints2):
    #   send this to both clients    
    
    def turn(self):
        
        working_letters = ['A','B','C','D','E','I','L','U','W']
        buffedLetter = random.choice(working_letters)
        debuffedLetter = random.choice(working_letters)
        
        
        #send(buffedLetter, debuffedLetter, self.player1.healthPoints, self.player2.healthPoints)
        
        #espero na porta por TIMEOUT segundos; devo receber uma string e um confidence

        #transformar as strings recebidas em magias, criar 
        self.player1.setSpell(decodificaSpell(spellFromClient1))
        self.player2.setSpell(decodificaSpell(spellFromClient2))

        dano1, dano2 = compara(magia1,magia2)

        self.player1.updateHealthPoints(dano1)
        self.player2.updateHealthPoints(dano2)


        




        