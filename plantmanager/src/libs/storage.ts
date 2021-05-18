/**
 * Storage será utilizado como agrupador das funções que serão utilizadas para tratar dos
 * itens que serão armazenados, lidos ou excluídos do storage do usuário
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * A biblioteca Notifications será utilizado para criarmos notificações
 * no dispositivo do usuário, para isso sempre que salvarmos uma planta
 * também será salvo um item de notificação
 */
import * as Notifications from "expo-notifications";
import { format } from "date-fns";

/**
 * Observe que estamos exportando a interface PlantProps
 * dessa forma a mesma pode ser utilizada em outras partes da nossa aplicação,
 * a mesma deverá ser usada sempre que formos salvar uma planta, afim de garantir
 * que iremos inserir as informações necessárias
 */
export interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string;
  dateTimeNotification: Date;
}

/**
 * a interface StoragePlantProps será utilizada quando
 * obtermos plantas armazenadas em nosso dispositivo
 */
export interface StoragePlantProps {
  [id: string]: {
    data: PlantProps;
    notificationId: string;
  };
}
/**
 * savePlant será utilizado para armazenar as plantas no dispositivo
 * do usuário, para isto recebemos um como parametro uma planta e a mesma
 * deverá ser passada de acordo com a interface PlantProps
 *
 */
export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    /**
     * nextTime será utilizado para criarmos a notificação que será exibida no
     * aplicativo, para isso de inicio iremos obter a hora que foi salva
     * para regar a planta e inserir no nextTime
     */
    const nextTime = new Date(plant.dateTimeNotification);
    const now = new Date();
    /**
     * Aqui estamos desestruturando os valores times e repeat_every de plant.frequency,
     * desta forma podemos usar estes valores
     */
    const { times, repeat_every } = plant.frequency;

    if (repeat_every == "week") {
      /**
       * Caso o prazo para repetição seja semanal iremos calcular
       * o intervalo como sendo 7 dividido pela quantidade de vezes
       * que a planta deve ser regada no intervalo de uma semana
       */
      const interval = Math.trunc(7 / times);
      nextTime.setDate(now.getDate() + interval);
    } else {
      /**
       * Caso a planta não possua uma frequencia semanal definida então a mesma deverá
       * ser regada no próximo dia após o horário salvo
       */
      nextTime.setDate(nextTime.getDate() + 1);
    }
    /**
     * seconds será o valor que será cadastrado na trigger
     * que iremos passar para o NotificationId que será a notificação que será
     * armazenada junto com a planta para ser exibida de acordo com a data atual menos a data
     * agendada para regar a planta, e isso tudo iremos dividir por 1000 para obtermos
     * os segundos ao inves de milisecundos
     */
    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
    );

    /**
     * Aqui criamos um const "notificationId" a mesma irá receber um "Evento" de notificação
     * que será armazenado junto a planta, neste evento é possível definir quando será chamado
     * a notificação(Em quantos segundos a partir que o evento for gravado no dispositivo) e podemos
     * definir se o mesmo será repitido ou não, abaixo 'seconds' é definido com base na diferença
     * de tempo entre o agendamento do evento e o tempo atual
     */
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Heeey,🌱",
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant,
        },
      },
      trigger: {
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true,
      },
    });

    /**
     * data recebe todas as plantas armazenadas no dispositivo, oldPlants recebe
     * as plantas porém é feito uma checagem, caso data não tenha recebido dados por não
     * haver plantas salvas então oldPlants recebe um objeto vazio, caso contrário
     * iremos transformar data que nos é retornado como JSON para um objeto utilizando
     * JSON.parse e então iremos inserir este valor em oldPlants, utilizaremos ainda a 
     * interface StoragePlantProps para garantir que todas as plantas possuam os mesmos
     * atributos.
     * Por fim newPlant recebe o plant.id como identificador e então recebe como data
     * a planta passada como parâmetro para a função SavePlant, observe que estamos salvando junto
     * a planta o notificationId também, ou seja estamos salvando a notificação
     */
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};
    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationId,
      },
    };

    /**
     * Para finalizar o salvamento é realizado o setItem da nova planta,
     * para isso transformamos o objeto newPlant e oldPlants em um JSON
     * para poder salva-los usando o AsyncStorage
     */
    await AsyncStorage.setItem(
      "@plantmanager:plants",
      JSON.stringify({
        ...newPlant,
        ...oldPlants,
      })
    );
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * loadPlant será utilizado para carregar as plantas que estão salvas no dispositivo 
 * do usuário, para isto utilizamos a interface PlantProps afim de garantir que 
 * os dados retornados seguirão o mesmo padrão
 */
export async function loadPlant(): Promise<PlantProps[]> {
  try {
    /**
     * data recebe de forma bruta os dados das plantas salvas no dispositivo do usuário
     * plantas recebe o tratamento destes dados, igual na função savePlant
     */
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    /**
     * plantsSorted receberá as plantas sorteadas de acordo com a data de notificação
     * das mesmas, para isso usamos o Object.keys(plants) para percorrer os identificadores
     * das plantas que quando salvamos nós definimos como sendo o próprio plant.id, sendo assim,
     * ao realizamos o map iremos percorrer os ids das plantas, com base nisso iremos retornar a planta mais
     * um elemento hora que será a hora de notificação da planta formatada em HH:mm.
     * 
     * Por fim é realizado o sort que retorna os elementos organizados de acordo com a data de notificação
     */
    const plantsSorted = Object.keys(plants)
      .map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(
            new Date(plants[plant].data.dateTimeNotification),
            "HH:mm"
          ),
        };
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
            Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      );
    return plantsSorted;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * removePlant será utilizado para realizar o delete de uma planta armazenada no dispositivo,
 * para isto será realizado basicamente o carregamento de todas as plantas salvas
 * no dispositivo do usuário e após isto iremos procurar a planta que queremos
 * excluir com base no id passado para removePlant
 */
export async function removePlant(id: string): Promise<void> {
  const data = await AsyncStorage.getItem("@plantmanager:plants");
  const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

  //Necessário cancelar o agendamento de notificações da planta excluída
  await Notifications.cancelScheduledNotificationAsync(
    plants[id].notificationId
  );

  //delete da planta com base no id passado para removePlant
  delete plants[id];

  //após realizar o delete é necessário gravas as plantas novamente no dispositivo
  await AsyncStorage.setItem("@plantmanager:plants", JSON.stringify(plants));
}
