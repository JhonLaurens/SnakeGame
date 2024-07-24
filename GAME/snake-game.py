import pygame
import random
import json

# Inicializar pygame
pygame.init()

# Definir colores
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Dimensiones de la pantalla
WIDTH, HEIGHT = 600, 400
GRID_SIZE = 20

# Configurar la pantalla
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Juego de Snake')

# Reloj para controlar la velocidad del juego
clock = pygame.time.Clock()

# Función para generar una posición aleatoria para la comida
def get_random_food_position():
    return (random.randint(0, (WIDTH - GRID_SIZE) // GRID_SIZE) * GRID_SIZE,
            random.randint(0, (HEIGHT - GRID_SIZE) // GRID_SIZE) * GRID_SIZE)

# Función para dibujar la serpiente
def draw_snake(snake):
    for segment in snake:
        pygame.draw.rect(screen, GREEN, pygame.Rect(segment[0], segment[1], GRID_SIZE, GRID_SIZE))

# Función para dibujar la comida
def draw_food(food):
    pygame.draw.rect(screen, RED, pygame.Rect(food[0], food[1], GRID_SIZE, GRID_SIZE))

# Función para mostrar texto en pantalla
def draw_text(text, size, color, x, y):
    font = pygame.font.Font(None, size)
    text_surface = font.render(text, True, color)
    text_rect = text_surface.get_rect()
    text_rect.center = (x, y)
    screen.blit(text_surface, text_rect)

# Función para guardar el puntaje en un archivo
def save_score(score):
    try:
        with open('scores.json', 'r') as file:
            scores = json.load(file)
    except FileNotFoundError:
        scores = []

    scores.append(score)
    with open('scores.json', 'w') as file:
        json.dump(scores, file)

# Pantalla de inicio
def show_start_screen():
    screen.fill(BLACK)
    draw_text('Juego de Snake', 50, WHITE, WIDTH // 2, HEIGHT // 4)
    draw_text('Presiona cualquier tecla para iniciar', 30, WHITE, WIDTH // 2, HEIGHT // 2)
    pygame.display.flip()
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            if event.type == pygame.KEYDOWN:
                waiting = False

# Pantalla de Game Over
def show_game_over_screen(score):
    screen.fill(BLACK)
    draw_text('Game Over', 50, RED, WIDTH // 2, HEIGHT // 4)
    draw_text(f'Score: {score}', 30, WHITE, WIDTH // 2, HEIGHT // 2)
    draw_text('Presiona R para reiniciar o Q para salir', 30, WHITE, WIDTH // 2, HEIGHT // 1.5)
    pygame.display.flip()
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r:
                    waiting = False
                    main()
                elif event.key == pygame.K_q:
                    pygame.quit()
                    exit()

# Función principal del juego
def main():
    show_start_screen()
    snake = [(100, 100)]
    direction = (0, 0)
    food = get_random_food_position()
    score = 0
    speed = 10

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and direction != (0, GRID_SIZE):
                    direction = (0, -GRID_SIZE)
                elif event.key == pygame.K_DOWN and direction != (0, -GRID_SIZE):
                    direction = (0, GRID_SIZE)
                elif event.key == pygame.K_LEFT and direction != (GRID_SIZE, 0):
                    direction = (-GRID_SIZE, 0)
                elif event.key == pygame.K_RIGHT and direction != (-GRID_SIZE, 0):
                    direction = (GRID_SIZE, 0)

        if not running:
            break

        # Mover la serpiente
        new_head = (snake[0][0] + direction[0], snake[0][1] + direction[1])
        snake.insert(0, new_head)

        # Comprobar si la serpiente ha comido la comida
        if snake[0] == food:
            score += 1
            food = get_random_food_position()
            if score % 5 == 0:
                speed += 2
        else:
            snake.pop()

        # Comprobar colisiones
        if (snake[0][0] < 0 or snake[0][0] >= WIDTH or
            snake[0][1] < 0 or snake[0][1] >= HEIGHT or
            snake[0] in snake[1:]):
            running = False

        # Dibujar todo
        screen.fill(BLACK)
        draw_snake(snake)
        draw_food(food)
        pygame.display.flip()

        # Controlar la velocidad del juego
        clock.tick(speed)

    save_score(score)
    show_game_over_screen(score)

if __name__ == '__main__':
    main()